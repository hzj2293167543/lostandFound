import { ChatParams } from '@/api/modules/ai.api';
import { getApiBaseUrl } from '@/api/client';
import { useAuthStore } from '@/stores/AuthStore';

interface StreamSource {
  id: number;
  content: string;
  type: string;
  createdAt: Date;
}

export interface StreamResponse {
  answer: string;
  sources: StreamSource[];
}

export async function streamChat(
  params: ChatParams,
  onChunk: (chunk: string) => void
): Promise<StreamResponse> {
  const token = useAuthStore.getState().token;
  const apiBaseUrl = await getApiBaseUrl();
  const response = await fetch(`${apiBaseUrl}/ai/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  let fullAnswer = '';
  let sources: StreamSource[] = [];

  try {
    for await (const line of linesFromStream(reader)) {
      const state = processLine(line, { fullAnswer, sources }, onChunk);
      fullAnswer = state.fullAnswer;
      sources = state.sources;
    }
  } finally {
    reader.releaseLock();
  }

  return { answer: fullAnswer, sources };
}

async function* linesFromStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  let leftover = '';
  while (true) {
    // oxlint-disable-next-line no-await-in-loop
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const texts = (leftover + chunk).split('\n');
    leftover = texts.pop() || '';
    for (const text of texts) yield text;
  }
  if (leftover) yield leftover;
}

function processLine(
  line: string,
  state: { fullAnswer: string; sources: StreamSource[] },
  onChunk: (chunk: string) => void
): { fullAnswer: string; sources: StreamSource[] } {
  if (!line.startsWith('data: ')) return state;
  const data = line.slice(6);
  if (data === '[DONE]') return state;

  try {
    const parsed = JSON.parse(data) as {
      type: string;
      content?: string;
      sources?: StreamSource[];
    };
    if (parsed.type === 'chunk' && parsed.content) {
      state.fullAnswer += parsed.content;
      onChunk(parsed.content);
    } else if (parsed.type === 'done') {
      state.sources = parsed.sources || [];
    }
  } catch {
    throw new Error('Invalid line');
  }
  return state;
}
