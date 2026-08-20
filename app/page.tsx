'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sidebar, SidebarTab } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { WelcomeView } from '@/components/chat/WelcomeView';
import { ChatMessage, LoadingIndicator } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessageItem } from '@/types/chat';
import { MOCK_RESPONSES, CURRENT_PRODUCT } from '@/lib/mockData';
import { History, Package, Settings, PlusCircle } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // 질문 전송 처리
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text.trim() }),
      });

      if (!res.ok) {
        throw new Error('API 오류가 발생했습니다.');
      }

      const data = await res.json();
      
      const aiMessage: ChatMessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sources: data.sources?.map((src: any, index: number) => ({
          id: `src-${Date.now()}-${index}`,
          author: src.metadata?.author || '익명',
          rating: src.metadata?.rating || 5,
          relevanceScore: src.score || 0,
          content: src.content || '',
        })),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessageItem = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 새 대화 시작 (웰컴 화면 리셋)
  const handleNewChat = () => {
    setMessages([]);
    setActiveTab('chat');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* 좌측 사이드바 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onNewChat={handleNewChat}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white shadow-xs">
        {/* 상단 헤더 */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* 탭별 뷰 전환 */}
        {activeTab === 'chat' ? (
          <main className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
            {/* 스크롤 가능한 대화 영역 또는 웰컴 화면 */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              {messages.length === 0 ? (
                /* 프롬프트 실행 전 웰컴 화면 (@chat_1.png) */
                <WelcomeView onSelectQuestion={handleSendMessage} />
              ) : (
                /* 프롬프트 실행 후 대화 인터페이스 (@chat_2.png) */
                <div className="max-w-4xl mx-auto space-y-6">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}

                  {isLoading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* 하단 질문 입력창 */}
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder={`${CURRENT_PRODUCT.name} 리뷰에 대해 질문해보세요...`}
            />
          </main>
        ) : (
          /* 기타 메뉴 탭 (히스토리, 상품 선택, 설정) 안내 뷰 */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            {activeTab === 'history' && (
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <History className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">대화 기록</h2>
                <p className="text-sm text-slate-500">
                  이전 리뷰 분석 대화 내역을 조회할 수 있는 공간입니다. (준비 중)
                </p>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  새 대화 시작하기
                </button>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">상품 선택</h2>
                <p className="text-sm text-slate-500">
                  현재 분석 대상: <span className="font-semibold text-slate-800">{CURRENT_PRODUCT.name}</span>
                </p>
                <p className="text-xs text-slate-400">
                  다른 의료기기 및 혈압계 모델 선택 기능이 곧 지원될 예정입니다.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Settings className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">설정</h2>
                <p className="text-sm text-slate-500">
                  AI 분석 파라미터 및 프롬프트 환경설정 메뉴입니다.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
