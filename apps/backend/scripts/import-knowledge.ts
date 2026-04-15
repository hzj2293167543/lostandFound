// oxlint-disable unicorn/prefer-top-level-await
// oxlint-disable no-await-in-loop
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { KnowledgeBase } from '../src/ai/entities/knowledge-base.entity';
import { EmbeddingService } from '../src/ai/embedding.service';
import { DocumentParserService } from '../src/ai/document-parser.service';
import { DataSource, Repository } from 'typeorm';
import { RecursiveCharacterTextSplitter, MarkdownTextSplitter } from '@langchain/textsplitters';
import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { Document } from '@langchain/core/documents';
import * as fs from 'fs';
import * as path from 'path';
import { KNOWLEDGE_ENTRIES } from './knowledge-entries.constant';
import { TKnowledgeType } from '@lostfound/shared';

const TEXT_DIR = path.join(__dirname, 'testData');

const defaultSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
  separators: ['\n\n', '\n', '。', '！', '？', '.', '!', '?', ' ', ''],
});

const mdSplitter = new MarkdownTextSplitter({
  chunkSize: 500,
  chunkOverlap: 100,
});

function inferFileType(fileName: string): 'faq' | 'notice' | 'rule' {
  const lower = fileName.toLowerCase();
  if (lower.includes('faq')) return 'faq';
  if (lower.includes('notice')) return 'notice';
  if (lower.includes('rule')) return 'rule';
  return 'faq';
}

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    txt: 'text/plain',
    md: 'text/markdown',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls: 'application/vnd.ms-excel',
    pptx: 'application/vnd.openxmlformats-officedocument.presentational.presentation',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

async function splitFAQText(text: string): Promise<string[]> {
  const chunks: string[] = [];
  const parts = text.split(/(?=\n\d+[.、)）])/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.length === 0) continue;
    if (trimmed.length <= 400) {
      chunks.push(trimmed);
    } else {
      const subChunks = await defaultSplitter.splitText(trimmed);
      chunks.push(...subChunks);
    }
  }
  return chunks.length > 0 ? chunks : [text];
}

async function getChunks(text: string, format: string): Promise<string[]> {
  if (!text || text.trim().length === 0) return [];

  if (/\n\d+[.、)）]/.test(text)) {
    return splitFAQText(text);
  }

  switch (format) {
    case 'md': {
      const doc = new Document({ pageContent: text });
      const splitDocs = await mdSplitter.splitDocuments([doc]);
      return splitDocs.map((d) => d.pageContent);
    }
    case 'xlsx':
    case 'xls':
      return text.length > 800 ? defaultSplitter.splitText(text) : [text];
    default: {
      const doc = new Document({ pageContent: text });
      const splitDocs = await defaultSplitter.splitDocuments([doc]);
      return splitDocs.map((d) => d.pageContent);
    }
  }
}

async function extractText(
  filePath: string,
  buffer: Buffer,
  ext: string,
  mimeType: string,
  documentParserService: DocumentParserService
): Promise<string> {
  if (ext === 'pptx') {
    const loader = new PPTXLoader(filePath);
    const docs = await loader.load();
    return docs.map((d) => d.pageContent).join('\n\n');
  }
  const parsed = await documentParserService.parseFile(buffer, filePath, mimeType);
  return parsed.content;
}

async function importFile(
  filePath: string,
  buffer: Buffer,
  ext: string,
  processedContents: Set<string>,
  documentParserService: DocumentParserService,
  knowledgeRepo: unknown,
  embeddingService: EmbeddingService
): Promise<number> {
  const mimeType = getMimeType(ext);
  const extractedText = await extractText(filePath, buffer, ext, mimeType, documentParserService);
  const chunks = await getChunks(extractedText, ext);
  const fileType = inferFileType(filePath);

  console.log(`  [${ext}] Generated ${chunks.length} chunks from ${extractedText.length} chars`);

  const newChunks = chunks.filter((chunk) => {
    if (processedContents.has(chunk)) {
      return false;
    }
    processedContents.add(chunk);
    return true;
  });

  if (newChunks.length === 0) {
    console.log(`  Skipped all chunks (duplicates).`);
    return 0;
  }

  const embeddings = await Promise.all(
    newChunks.map((chunk) => embeddingService.createEmbedding(chunk))
  );

  if (!(knowledgeRepo instanceof Repository)) {
    throw new Error('knowledgeRepo must be a Repository instance');
  }

  const entities = newChunks.map((chunk, index) =>
    knowledgeRepo.create({
      content: chunk,
      embedding: embeddings[index],
      type: fileType,
    })
  );

  await knowledgeRepo.save(entities);
  return newChunks.length;
}

async function importFromFiles(
  knowledgeRepo: unknown,
  embeddingService: EmbeddingService,
  documentParserService: DocumentParserService
): Promise<number> {
  let imported = 0;
  const dirs = ['txt', 'md', 'pdf', 'docx', 'xlsx', 'xls', 'pptx'];
  const processedContents = new Set<string>();

  for (const dir of dirs) {
    const dirPath = path.join(TEXT_DIR, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const buffer = fs.readFileSync(filePath);
      const ext = file.toLowerCase().split('.').pop() || '';

      try {
        console.log(`Parsing: ${file}`);
        const count = await importFile(
          filePath,
          buffer,
          ext,
          processedContents,
          documentParserService,
          knowledgeRepo,
          embeddingService
        );
        imported += count;
      } catch (error) {
        console.error(`  Failed to import ${file}:`, error.message);
      }
    }
  }

  return imported;
}

async function bootstrap() {
  console.log('Starting knowledge base import...');
  console.log('='.repeat(50));

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const embeddingService = app.get(EmbeddingService);
  const documentParserService = app.get(DocumentParserService);
  const knowledgeRepo = dataSource.getRepository(KnowledgeBase);

  console.log('\n1. Importing from testData files...');
  console.log('-'.repeat(50));
  const fileCount = await importFromFiles(knowledgeRepo, embeddingService, documentParserService);
  console.log(`\nFiles imported: ${fileCount} chunks`);

  console.log('\n2. Importing predefined entries...');
  console.log('-'.repeat(50));
  let imported = 0;
  const processedContents = new Set<string>();

  for (const entry of KNOWLEDGE_ENTRIES) {
    if (processedContents.has(entry.content)) continue;

    try {
      const existing = await knowledgeRepo.findOne({ where: { content: entry.content } });
      if (existing) {
        processedContents.add(entry.content);
        continue;
      }

      const embedding = await embeddingService.createEmbedding(entry.content);
      await knowledgeRepo.save(
        knowledgeRepo.create({
          content: entry.content,
          embedding: embedding,
          type: entry.type as TKnowledgeType,
        })
      );

      processedContents.add(entry.content);
      imported++;
    } catch (error) {
      console.error(`Failed: ${entry.content.slice(0, 30)}...`, error.message);
    }
  }

  const totalCount = await knowledgeRepo.count();
  console.log('\n' + '='.repeat(50));
  console.log(`Import completed!`);
  console.log(`  Predefined entries imported: ${imported}`);
  console.log(`  Total entries in database: ${totalCount}`);
  await app.close();
}

bootstrap();
