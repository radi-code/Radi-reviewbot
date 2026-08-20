import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediReview AI - 혈압계 리뷰 분석 챗봇',
  description: '오므론 HEM-7156T 실사용자 리뷰 기반 객관적인 AI 분석 챗봇',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full bg-slate-50 text-slate-900 antialiased flex">
        {children}
      </body>
    </html>
  );
}
