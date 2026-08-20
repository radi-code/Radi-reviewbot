'use client';

import React from 'react';
import { Activity, UserCheck, Eye, Smartphone } from 'lucide-react';
import { PRESET_QUESTIONS } from '@/lib/mockData';
import { PresetQuestion } from '@/types/chat';

interface WelcomeViewProps {
  onSelectQuestion: (questionText: string) => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onSelectQuestion }) => {
  const getIcon = (iconName: PresetQuestion['iconName']) => {
    switch (iconName) {
      case 'pulse':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'user':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'eye':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'phone':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      default:
        return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 text-center animate-in fade-in duration-300">
      {/* 중앙 심전도 아이콘 */}
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs mb-6 ring-1 ring-blue-100">
        <Activity className="w-8 h-8 stroke-[2.2]" />
      </div>

      {/* 환영 타이틀 및 안내 */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
        오므론 HEM-7156T 리뷰 분석 챗봇에 오신 것을 환영합니다!
      </h1>
      <p className="text-sm sm:text-base text-slate-500 max-w-xl leading-relaxed mb-10">
        상품에 대해 궁금한 점을 물어보세요. 리뷰 데이터를 기반으로 객관적인 답변을 제공합니다.
      </p>

      {/* 2x2 추천 질문 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-3xl text-left">
        {PRESET_QUESTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              // 따옴표를 제거하고 순수 질문 텍스트 전달
              const cleanText = item.question.replace(/^"|"$/g, '');
              onSelectQuestion(cleanText);
            }}
            className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-xs transition-all duration-200 cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50/80 group-hover:bg-blue-100/70 text-blue-600 flex items-center justify-center shrink-0 transition-colors">
              {getIcon(item.iconName)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                {item.question}
              </p>
              <p className="text-sm text-slate-400 mt-1 font-normal">
                {item.category}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
