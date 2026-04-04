import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeBase } from './entities/knowledge-base.entity';
import { EmbeddingService } from './embedding.service';
import { LLMService } from './llm.service';
import { ChatMessage, KnowledgeBaseItem } from '@lostfound/shared';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeRepository: Repository<KnowledgeBase>,
    private embeddingService: EmbeddingService,
    private llmService: LLMService
  ) {}

  async chat(
    question: string,
    history: ChatMessage[] = []
  ): Promise<{
    answer: string;
    sources: KnowledgeBaseItem[];
  }> {
    const questionEmbedding = await this.embeddingService.createEmbedding(question);

    const results = await this.searchSimilarKnowledge(questionEmbedding, 10);

    const reranked = await this.rerankDocuments(question, results, 5);

    if (reranked.length === 0) {
      const messages: ChatMessage[] = [...history, { role: 'user', content: question }];
      const answer = await this.llmService.chat(messages);
      return { answer, sources: [] };
    }

    const context = reranked.map((r, i) => `[${i + 1}] ${r.content}`).join('\n');

    const systemPrompt: ChatMessage = {
      role: 'assistant',
      content: `你是失物招领平台的智能客服助手。请根据提供的参考信息回答用户的问题。\n\n参考信息：\n${context}\n\n如果参考信息中没有相关内容，请基于你的知识回答，但不要声称这是参考信息提供的内容。`,
    };

    const messages: ChatMessage[] = [systemPrompt, ...history, { role: 'user', content: question }];

    const answer = await this.llmService.chat(messages);

    const sources: KnowledgeBaseItem[] = reranked.map((r) => ({
      id: r.id,
      content: r.content,
      type: r.type,
      createdAt: r.createdAt,
    }));

    return { answer, sources };
  }

  async streamChat(
    question: string,
    history: ChatMessage[] = [],
    onChunk: (chunk: string) => void
  ): Promise<{ answer: string; sources: KnowledgeBaseItem[] }> {
    const questionEmbedding = await this.embeddingService.createEmbedding(question);

    const results = await this.searchSimilarKnowledge(questionEmbedding, 10);

    const reranked = await this.rerankDocuments(question, results, 5);

    let answer: string;

    if (reranked.length === 0) {
      const messages: ChatMessage[] = [...history, { role: 'user', content: question }];
      answer = await this.llmService.streamChat(messages, onChunk);
      return { answer, sources: [] };
    }

    const context = reranked.map((r, i) => `[${i + 1}] ${r.content}`).join('\n');

    const systemPrompt: ChatMessage = {
      role: 'assistant',
      content: `你是失物招领平台的智能客服助手。请根据提供的参考信息回答用户的问题。\n\n参考信息：\n${context}\n\n如果参考信息中没有相关内容，请基于你的知识回答，但不要声称这是参考信息提供的内容。`,
    };

    const messages: ChatMessage[] = [systemPrompt, ...history, { role: 'user', content: question }];

    answer = await this.llmService.streamChat(messages, onChunk);

    const sources: KnowledgeBaseItem[] = reranked.map((r) => ({
      id: r.id,
      content: r.content,
      type: r.type,
      createdAt: r.createdAt,
    }));

    return { answer, sources };
  }

  private async searchSimilarKnowledge(
    embedding: number[],
    limit: number
  ): Promise<KnowledgeBase[]> {
    const embeddingStr = `[${embedding.join(',')}]`;
    const results = await this.knowledgeRepository
      .createQueryBuilder('kb')
      .where('kb.embedding IS NOT NULL')
      .orderBy(`kb.embedding <=> '${embeddingStr}'::vector`, 'ASC')
      .limit(limit)
      .getMany();

    return results;
  }

  private async rerankDocuments(
    question: string,
    candidates: KnowledgeBase[],
    topK: number
  ): Promise<KnowledgeBase[]> {
    if (candidates.length === 0) return [];
    if (candidates.length === 1) return candidates.slice(0, topK);

    const scores = await this.llmService.rerank(
      question,
      candidates.map((c) => c.content)
    );

    const scoreMap = new Map(scores.map((s) => [s.index, s.score]));

    const scored = candidates.map((c, i) => ({
      doc: c,
      score: scoreMap.get(i) ?? 0,
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map((s) => s.doc);
  }
}
