import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AIChatDialog } from './AIChatDialog';

export function AIChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        aria-label="打开AI助手">
        <MessageCircle className="size-6 text-white mx-auto group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 animate-pulse" />
      </button>
      <AIChatDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
