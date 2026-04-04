import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIController } from './ai.controller';
import { ChatService } from './chat.service';
import { EmbeddingService } from './embedding.service';
import { LLMService } from './llm.service';
import { DocumentParserService } from './document-parser.service';
import { KnowledgeImportService } from './knowledge-import.service';
import { KnowledgeBase } from './entities/knowledge-base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeBase])],
  controllers: [AIController],
  providers: [
    ChatService,
    EmbeddingService,
    LLMService,
    DocumentParserService,
    KnowledgeImportService,
  ],
  exports: [ChatService, DocumentParserService, KnowledgeImportService],
})
export class AIModule {}
