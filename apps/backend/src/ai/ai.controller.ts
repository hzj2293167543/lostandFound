import {
  ChatRequest,
  ChatRequestSchema,
  KNOWLEDGE_IMPORT_CONFIG,
  KnowledgeType,
} from '@lostfound/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { OptionalJwtAuthGuard } from '../common/guards/OptionalJwtAuthGuard.guard';
import { ChatService } from './chat.service';
import { KnowledgeImportService } from './knowledge-import.service';
import type { Express } from 'express';

@Controller('ai')
export class AIController {
  constructor(
    private readonly chatService: ChatService,
    private readonly knowledgeImportService: KnowledgeImportService
  ) {}

  @Post('chat')
  @UseGuards(OptionalJwtAuthGuard)
  async chat(@Body() body: ChatRequest) {
    const { question, history } = ChatRequestSchema.parse(body);
    const result = await this.chatService.chat(question, history || []);
    return result;
  }

  @Post('chat/stream')
  @UseGuards(OptionalJwtAuthGuard)
  async streamChat(@Body() body: ChatRequest, @Res() res: Response) {
    const { question, history } = ChatRequestSchema.parse(body);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const { sources } = await this.chatService.streamChat(question, history || [], (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
      });

      res.write(`data: ${JSON.stringify({ type: 'done', sources })}\n\n`);
      res.end();
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ type: 'error', message: 'Stream error', error: error.message || 'Unknown error' })}\n\n`
      );
      res.end();
    }
  }

  @Post('knowledge/import')
  @UseGuards(OptionalJwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: KNOWLEDGE_IMPORT_CONFIG.maxSize },
    })
  )
  async importKnowledge(@UploadedFile() file: Express.Multer.File, @Body('type') typeStr: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const typeMap: Record<string, (typeof KnowledgeType)[keyof typeof KnowledgeType]> = {
      faq: KnowledgeType.FAQ,
      notice: KnowledgeType.NOTICE,
      rule: KnowledgeType.RULE,
    };

    const type = typeMap[typeStr] || KnowledgeType.FAQ;

    const result = await this.knowledgeImportService.importFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      type
    );

    return result;
  }
}
