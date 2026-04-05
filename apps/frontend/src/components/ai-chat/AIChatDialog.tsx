import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@lostfound/shared';
import { Loader2, SendIcon, TrashIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAIChat } from './useAIChat.hook';
import { KeyboardEvent } from 'react';

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar className="size-8 shrink-0">
        <AvatarFallback
          className={isUser ? 'bg-accent text-accent-foreground' : 'bg-ai-primary text-white'}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent text-accent-foreground rounded-tr-sm'
            : 'bg-muted text-muted-foreground rounded-tl-sm'
        }`}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ children }) => (
              <code className="bg-muted-foreground/20 rounded px-1 py-0.5 text-xs">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-secondary text-secondary-foreground rounded p-2 overflow-x-auto mb-2 text-xs">
                {children}
              </pre>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-foreground underline">
                {children}
              </a>
            ),
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
          }}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-ai-primary text-white">AI</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1">
          <span
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="size-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const [input, setInput] = useState('');
  const { messages, isStreaming, sendMessage, clearMessages } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const question = input.trim();
    setInput('');
    await sendMessage(question);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="p-0 gap-0 max-w-md w-full h-[600px] max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-ai-primary to-ai-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">智能助手</h2>
              <p className="text-xs text-muted-foreground">失物招领平台客服</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-foreground">
            <TrashIcon className="size-4" />
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="size-16 rounded-full bg-gradient-to-br from-ai-primary/20 to-ai-secondary/20 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👋</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">你好，有什么可以帮我？</h3>
                <p className="text-sm text-muted-foreground">我可以回答关于失物招领平台的问题</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i + msg.role} message={msg} />
            ))}
            {isStreaming && messages.at(-1)?.role !== 'assistant' && <TypingIndicator />}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-muted">
          <div className="flex gap-3">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入问题..."
              className="min-h-[44px] max-h-[120px] resize-none bg-background"
              rows={1}
              disabled={isStreaming}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="shrink-0 bg-ai-primary hover:bg-ai-primary/90">
              {isStreaming ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendIcon className="size-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            AI 可能会产生不准确的信息，请谨慎参考
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
