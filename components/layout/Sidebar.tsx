'use client';

import React from 'react';
import {
  ShieldCheck,
  Plus,
  MessageSquarePlus,
  History,
  Package,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SidebarTab = 'chat' | 'history' | 'products' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onNewChat,
}) => {
  const menuItems: { id: SidebarTab; label: string; icon: React.ElementType }[] = [
    { id: 'chat', label: '새 대화', icon: MessageSquarePlus },
    { id: 'history', label: '대화 기록', icon: History },
    { id: 'products', label: '상품 선택', icon: Package },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <>
      {/* 모바일 배경 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 본체 */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-slate-50/95 border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 space-y-6">
          {/* 상단 로고 & 타이틀 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 text-xl leading-tight tracking-tight">
                  MediReview AI
                </h1>
                <p className="text-sm text-slate-400 font-medium tracking-wide">
                  Clinical Data Assistant
                </p>
              </div>
            </div>

            {/* 모바일 닫기 버튼 */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 md:hidden cursor-pointer"
              aria-label="사이드바 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 파란색 주요 버튼: 새 대화 */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onSelectTab('chat');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>새 대화</span>
          </button>

          {/* 네비게이션 메뉴 리스트 */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    if (item.id === 'chat') {
                      // 챗 탭 선택 시
                    }
                    onClose();
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left',
                    isActive
                      ? 'bg-blue-100/70 text-blue-700 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-blue-600' : 'text-slate-500'
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 사이드바 하단: 인덱싱 버튼 + 버전 정보 */}
        <div className="p-4 border-t border-slate-200/60 space-y-3">
          <button
            type="button"
            onClick={async () => {
              if (!confirm('샘플 데이터를 Pinecone과 Supabase에 인덱싱하시겠습니까?')) return;
              try {
                const res = await fetch('/api/index-data', { method: 'POST' });
                if (res.ok) alert('인덱싱 완료!');
                else {
                  const data = await res.json();
                  alert(`인덱싱 실패: ${data.details || '알 수 없는 오류'}`);
                }
              } catch (e) {
                alert('네트워크 오류가 발생했습니다.');
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-600 font-medium text-xs rounded-xl hover:bg-indigo-100 active:bg-indigo-200 transition-all duration-150 cursor-pointer border border-indigo-100"
          >
            <Package className="w-3.5 h-3.5" />
            <span>샘플 데이터 인덱싱</span>
          </button>
          <div className="text-base text-slate-400 flex items-center justify-between">
            <span>v1.0.0</span>
            <span>MediReview AI</span>
          </div>
        </div>
      </aside>
    </>
  );
};
