import { streamChat } from '@/services/api.services';
import { post } from '../client';
import { ChatMessage, ChatResponse } from '@lostfound/shared';

export interface ChatParams {
  question: string;
  history?: ChatMessage[];
}

export const aiApi = {
  chat: (params: ChatParams) => post<ChatResponse>('/ai/chat', params),

  streamChat: async (params: ChatParams, onChunk: (chunk: string) => void) =>
    await streamChat(params, onChunk),
};

export default aiApi;
