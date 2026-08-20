'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { ChatMessageItem } from '@/types/chat';
import { SourceCard } from './SourceCard';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: ChatMessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-xl bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm font-medium shadow-xs leading-relaxed">
          {message.text}
        </div>
      </div>
    );
  }

  // AI 응답
  return (
    <div className="flex items-start gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* AI 아바타 아이콘 */}
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <Bot className="w-4 h-4" />
      </div>

      <div className="flex-1 space-y-3 max-w-2xl">
        {/* AI 메시지 본문 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-800 shadow-2xs leading-relaxed">
          {message.text}
        </div>

        {/* 출처 리뷰 카드 (SourceCard) */}
        {message.sources && message.sources.length > 0 && (
          <div className="space-y-2 pt-0.5">
            {message.sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 w-full animate-in fade-in duration-200">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-4 py-3 text-sm text-slate-800 shadow-2xs">
        <div className="flex items-center gap-1.5 h-5">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
