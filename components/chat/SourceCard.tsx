'use client';

import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';
import { cn } from '@/lib/utils';
import { SourceReview } from '@/types/chat';

export interface SourceCardProps {
  source: SourceReview;
  defaultExpanded?: boolean;
  className?: string;
}

export const SourceCard: React.FC<SourceCardProps> = ({
  source,
  defaultExpanded = true,
  className,
}) => {
  const [isCardOpen, setIsCardOpen] = useState(defaultExpanded);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Pinecone 유사도 점수 포맷팅 (0.98 -> '98%' 또는 '0.98')
  const formattedScore =
    source.relevanceScore <= 1
      ? `${Math.round(source.relevanceScore * 100)}% 일치`
      : `${source.relevanceScore}% 일치`;

  // 작성자 이니셜 추출
  const initial = source.author.charAt(0) || '리';

  return (
    <div
      className={cn(
        'w-full max-w-xl rounded-xl border border-slate-200/90 bg-white shadow-xs transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {/* 카드 헤더 (접기/펼치기 토글) */}
      <button
        type="button"
        onClick={() => setIsCardOpen(!isCardOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left text-sm cursor-pointer select-none"
        aria-expanded={isCardOpen}
      >
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
          <span>검증된 리뷰 출처</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pinecone 유사도 점수 배지 */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
            관련도 {source.relevanceScore >= 1 ? '1.00' : source.relevanceScore.toFixed(2)} ({formattedScore})
          </span>

          <span className="text-slate-400 hover:text-slate-600 transition-colors ml-1">
            {isCardOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </div>
      </button>

      {/* 카드 본문 (접힘 가능) */}
      {isCardOpen && (
        <div className="p-4 border-t border-slate-100 space-y-3 bg-white animate-in fade-in-50 duration-150">
          {/* 작성자 & 별점 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center">
                {initial}
              </div>
              <span className="text-sm font-medium text-slate-700">
                {source.author}
              </span>
            </div>

            <StarRating rating={source.rating} />
          </div>

          {/* 리뷰 내용 (2줄 + 더 보기) */}
          <div className="text-sm text-slate-600 leading-relaxed italic bg-slate-50/50 p-3 rounded-lg border border-slate-100">
            <p className={cn(!isTextExpanded && 'line-clamp-2')}>
              &ldquo;{source.content}&rdquo;
            </p>

            {source.content.length > 70 && (
              <button
                type="button"
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="mt-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors not-italic inline-block"
              >
                {isTextExpanded ? '접기' : '더 보기'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
