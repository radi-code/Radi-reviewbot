import { NextResponse } from 'next/server';
import { getVectorStore } from '@/lib/pinecone';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. LangChain PineconeStore로 유사도 검색 (상위 3개, score 포함)
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearchWithScore(query, 3);

    console.log(`[SEARCH] 쿼리: "${query}", 결과: ${results.length}건`);

    // 2. 결과 포맷팅
    const formattedResults = results.map(([doc, score]) => ({
      content: doc.pageContent,
      metadata: {
        id: doc.metadata?.id,
        title: doc.metadata?.title,
        rating: doc.metadata?.rating,
        author: doc.metadata?.author,
        date: doc.metadata?.date,
        verified_purchase: doc.metadata?.verified_purchase,
      },
      score,
    }));

    return NextResponse.json({
      text: '해당 리뷰 내용에 기반한 분석 결과입니다.',
      sources: formattedResults,
    });
  } catch (error: any) {
    console.error('[SEARCH ERROR]', error);
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    );
  }
}
