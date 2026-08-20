'use client';

import React from 'react';
import { Menu, Settings, HelpCircle, User, Activity } from 'lucide-react';
import { CURRENT_PRODUCT } from '@/lib/mockData';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-xs px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {/* 모바일 햄버거 메뉴 버튼 */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 상품명 타이틀 */}
        <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm sm:text-base">
          <span className="p-1 rounded-md bg-blue-50 text-blue-600">
            <Activity className="w-4 h-4" />
          </span>
          <span>{CURRENT_PRODUCT.name}</span>
        </div>
      </div>

      {/* 우측 아이콘 버튼 그룹 */}
      <div className="flex items-center gap-1 sm:gap-2 text-slate-500">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="설정"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="도움말"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="사용자"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
