import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private ollamaUrl: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.ollamaUrl = this.configService.get<string>('ai.ollama.url') || 'http://localhost:11434';
  }

  async createEmbedding(text: string): Promise<number[]> {
    const response = await axios.post(`${this.ollamaUrl}/api/embeddings`, {
      model: this.configService.get<string>('ai.ollama.model') || '',
      prompt: text,
    });

    if (response.data && response.data.embedding) {
      return response.data.embedding;
    }
    throw new Error('Unexpected response format from Ollama');
  }

  async createEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      // oxlint-disable-next-line no-await-in-loop
      const embedding = await this.createEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }
}
