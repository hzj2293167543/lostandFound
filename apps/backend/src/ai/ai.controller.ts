import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from '../common/guards/OptionalJwtAuthGuard.guard';
import { ChatService } from './chat.service';
import { KnowledgeImportService } from './knowledge-import.service';
import { ChatRequestSchema, ChatRequest } from '@lostfound/shared';
import { KnowledgeType } from './entities/knowledge-base.entity';
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
      limits: { fileSize: 50 * 1024 * 1024 },
    })
  )
  async importKnowledge(@UploadedFile() file: Express.Multer.File, @Body('type') typeStr: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const typeMap: Record<string, KnowledgeType> = {
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
