'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = '오므론 HEM-7156T 리뷰에 대해 질문해보세요...',
  className,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn('w-full max-w-4xl mx-auto px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent', className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-300/80 rounded-full pl-5 pr-14 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            'absolute right-2 p-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center',
            input.trim() && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
          aria-label="전송"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </form>

      {/* 하단 안내 문구 */}
      <p className="text-center text-xs text-slate-400 mt-2 tracking-tight">
        AI가 생성한 답변이므로 부정확한 정보가 포함될 수 있습니다.
      </p>
    </div>
  );
};
