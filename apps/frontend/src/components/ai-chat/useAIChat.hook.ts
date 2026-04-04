import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { aiApi, ChatParams } from '@/api/modules/ai.api';
import { ChatMessage } from '@lostfound/shared';

const MAX_ROUNDS = 10;

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingContentRef = useRef('');

  const chatMutation = useMutation({
    mutationFn: (params: ChatParams) => aiApi.chat(params),
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    },
  });

  const streamChatMutation = useMutation({
    mutationFn: (params: ChatParams) => {
      setIsStreaming(true);
      streamingContentRef.current = '';

      return new Promise<{ answer: string; sources?: unknown[] }>((resolve, reject) => {
        aiApi
          .streamChat(params, (chunk) => {
            streamingContentRef.current += chunk;
            setMessages((prev) => {
              const lastMsg = prev.at(-1);
              if (lastMsg?.role === 'assistant') {
                return [...prev.slice(0, -1), { ...lastMsg, content: streamingContentRef.current }];
              }
              return [...prev, { role: 'assistant' as const, content: chunk }];
            });
          })
          .then(resolve)
          .catch(reject)
          .finally(() => setIsStreaming(false));
      });
    },
  });

  const sendMessage = useCallback(
    async (question: string) => {
      const userMessage: ChatMessage = { role: 'user', content: question };
      setMessages((prev) => [...prev, userMessage]);

      const currentHistory = messages.slice(-MAX_ROUNDS * 2);

      try {
        await streamChatMutation.mutateAsync({
          question,
          history: currentHistory,
        });
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '抱歉，服务出现问题，请稍后重试。' },
        ]);
        setIsStreaming(false);
      }
    },
    [messages, streamChatMutation]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isStreaming: isStreaming || streamChatMutation.isPending,
    sendMessage,
    clearMessages,
    error: chatMutation.error || streamChatMutation.error,
  };
}
