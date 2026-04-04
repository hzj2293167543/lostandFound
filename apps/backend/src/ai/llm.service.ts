import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Readable } from 'stream';
import { ChatMessage } from '@lostfound/shared';
import { createParser } from 'eventsource-parser';

@Injectable()
export class LLMService {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ai.llm.apiKey') || '';
    this.apiUrl = this.configService.get<string>('ai.llm.chatUrl') || '';
    this.model = this.configService.get<string>('ai.llm.model') || '';
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    return response.data.choices?.[0]?.message?.content || '';
  }

  async streamChat(messages: ChatMessage[], onChunk: (chunk: string) => void): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
        timeout: 60000,
      }
    );

    let fullContent = '';
    const stream = response.data as Readable;
    return new Promise((resolve, reject) => {
      const parser = createParser({
        onEvent: (event) => {
          const data = event.data;
          if (!data || data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;

            if (content) {
              fullContent += content;
              onChunk(content);
            }
          } catch {
            // 忽略非标准 JSON 数据块
          }
        },
        onError: (err) => {
          reject(err);
        },
      });

      stream.on('data', (chunk: Buffer) => {
        parser.feed(chunk.toString());
      });

      stream.on('end', () => {
        resolve(fullContent);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  }

  async rerank(
    question: string,
    candidates: string[]
  ): Promise<{ index: number; score: number }[]> {
    if (candidates.length === 0) return [];

    const candidateTexts = candidates.map((c, i) => `[${i}] ${c}`).join('\n');

    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `你是一个文档相关性评分模型。请评估每个文档与问题的相关程度。\n\n问题：${question}\n\n文档：\n${candidateTexts}\n\n请以JSON数组格式返回，按相关性从高到低排序。格式：[{"index":0,"score":0.95},...]。只返回JSON，不要其他内容。`,
      },
    ];

    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    const content = response.data.choices?.[0]?.message?.content || '[]';

    const cleaned = content.replaceAll(/```json\n?|```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned) as { index: number; score: number }[];
      return parsed.sort((a, b) => b.score - a.score);
    } catch {
      return candidates.map((_, i) => ({ index: i, score: 1 - i * 0.1 }));
    }
  }
}
