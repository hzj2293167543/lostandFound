// oxlint-disable no-await-in-loop
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentParserService, ParsedDocument } from './document-parser.service';
import { EmbeddingService } from './embedding.service';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { ImportResult, KnowledgeType } from '@lostfound/shared';

@Injectable()
export class KnowledgeImportService {
  private readonly CHUNK_SIZE = 500;
  private readonly CHUNK_OVERLAP = 50;

  constructor(
    private readonly documentParserService: DocumentParserService,
    private readonly embeddingService: EmbeddingService,
    @InjectRepository(KnowledgeBase)
    private readonly knowledgeRepo: Repository<KnowledgeBase>
  ) {}

  async importFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    type: (typeof KnowledgeType)[keyof typeof KnowledgeType]
  ): Promise<ImportResult> {
    const result: ImportResult = {
      totalChunks: 0,
      imported: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const parsed: ParsedDocument = await this.documentParserService.parseFile(
        buffer,
        fileName,
        mimeType
      );
      const chunks = this.splitIntoChunks(parsed.content);

      result.totalChunks = chunks.length;

      for (const chunk of chunks) {
        try {
          const existing = await this.knowledgeRepo.findOne({
            where: { content: chunk },
          });

          if (existing) {
            result.skipped++;
            continue;
          }

          const embedding = await this.embeddingService.createEmbedding(chunk);

          const entity = this.knowledgeRepo.create({
            content: chunk,
            embedding,
            type,
            sourceFile: fileName,
          });

          await this.knowledgeRepo.save(entity);
          result.imported++;
        } catch (error) {
          result.errors.push(`Chunk import failed: ${error.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      result.errors.push(`File parse failed: ${error.message || 'Unknown error'}`);
    }

    return result;
  }

  private splitIntoChunks(text: string): string[] {
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length <= this.CHUNK_SIZE) {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = paragraph;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }
}
