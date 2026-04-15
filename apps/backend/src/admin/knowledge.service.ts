import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeImportService } from '@/ai/knowledge-import.service';
import { KnowledgeBase } from '@/ai/entities/knowledge-base.entity';
import { KnowledgeType } from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import type { Express } from 'express';

export interface DocumentInfo {
  sourceFile: string;
  type: string;
  chunkCount: number;
  uploadedAt: Date;
  preview: string;
}

@Injectable()
export class KnowledgeService {
  constructor(
    private knowledgeImportService: KnowledgeImportService,
    @InjectRepository(KnowledgeBase)
    private knowledgeRepo: Repository<KnowledgeBase>
  ) {}

  async importKnowledge(file: Express.Multer.File, typeStr: string) {
    const typeMap: Record<string, (typeof KnowledgeType)[keyof typeof KnowledgeType]> = {
      faq: KnowledgeType.FAQ,
      notice: KnowledgeType.NOTICE,
      rule: KnowledgeType.RULE,
    };

    const type = typeMap[typeStr] || KnowledgeType.FAQ;

    return await this.knowledgeImportService.importFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      type
    );
  }

  async getDocumentList(): Promise<DocumentInfo[]> {
    const result = await this.knowledgeRepo
      .createQueryBuilder('kb')
      .select('kb.source_file', 'sourceFile')
      .addSelect('kb.type', 'type')
      .addSelect('COUNT(*)', 'chunkCount')
      .addSelect('MIN(kb.created_at)', 'uploadedAt')
      .groupBy('kb.source_file')
      .addGroupBy('kb.type')
      .orderBy('MIN(kb.created_at)', 'DESC')
      .getRawMany();

    const sourceFiles = result.map((r) => r.sourceFile);

    let previews: { sourceFile: string; content: string | null }[] = [];
    if (sourceFiles.length > 0) {
      previews = await this.knowledgeRepo
        .createQueryBuilder('kb')
        .select('kb.source_file', 'sourceFile')
        .addSelect('kb.content', 'content')
        .where('kb.source_file IN (:...sourceFiles)', { sourceFiles })
        .orderBy('kb.created_at', 'ASC')
        .getRawMany();
    }

    const previewMap = new Map<string, string>();
    for (const p of previews) {
      if (!previewMap.has(p.sourceFile)) {
        previewMap.set(p.sourceFile, (p.content || '').slice(0, 100));
      }
    }

    return result.map((r) => ({
      sourceFile: r.sourceFile,
      type: r.type,
      chunkCount: parseInt(r.chunkCount, 10),
      uploadedAt: r.uploadedAt,
      preview: previewMap.get(r.sourceFile) || '',
    }));
  }

  async deleteDocument(sourceFile: string): Promise<{ deleted: number }> {
    const result = await this.knowledgeRepo.delete({ sourceFile });
    return { deleted: result.affected || 0 };
  }
}
