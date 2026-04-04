import { z } from 'zod';

export const KnowledgeTypeSchema = z.enum(['faq', 'notice', 'rule']);

export type KnowledgeType = z.infer<typeof KnowledgeTypeSchema>;

export const KnowledgeBaseItemSchema = z.object({
  id: z.number(),
  content: z.string(),
  type: KnowledgeTypeSchema,
  createdAt: z.date(),
});

export type KnowledgeBaseItem = z.infer<typeof KnowledgeBaseItemSchema>;

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  history: z.array(ChatMessageSchema).optional(),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(KnowledgeBaseItemSchema).optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

export const EmbeddingRequestSchema = z.object({
  texts: z.array(z.string()).min(1).max(100),
});

export type EmbeddingRequest = z.infer<typeof EmbeddingRequestSchema>;

export const EmbeddingResponseSchema = z.object({
  embeddings: z.array(z.array(z.number())),
});

export type EmbeddingResponse = z.infer<typeof EmbeddingResponseSchema>;
