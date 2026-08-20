import { NextResponse } from 'next/server';
import { getVectorStore } from '@/lib/pinecone';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// 시스템 프롬프트: AI의 역할과 답변 규칙 정의
const SYSTEM_TEMPLATE = `당신은 쇼핑 리뷰 분석 전문가입니다. 아래 <context>에 제공된 실제 리뷰 데이터만을 근거로 답변하세요.

답변 규칙:
- 반드시 <context>의 리뷰 내용에서만 근거를 찾을 것. 리뷰에 없는 일반론이나 배경 지식은 답변에 포함하지 말 것.
- 전체 답변은 5문장 이내로 간결하게.
- 첫 문장에서 결론부터 말할 것 (예: "대체로 착용이 쉽다는 평이 많습니다").
- 긍정/부정 의견이 섞여 있으면 둘 다 균형 있게 언급할 것.
- 목록이나 체크리스트를 만들지 말 것. 자연스러운 문장으로만 답할 것.
- 의학적 판단이나 조언(혈압 수치 해석, 치료 권고 등)은 하지 말 것.
- 리뷰 데이터에서 관련 내용을 찾을 수 없으면 "관련 리뷰를 찾지 못했습니다" 한 문장만 답할 것.

<context>
{context}
</context>`;

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. 유사도 검색 (상위 5개, score 포함)
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearchWithScore(query, 5);

    console.log(`[SEARCH] 쿼리: "${query}", 결과: ${results.length}건`);

    // 2. 검색된 리뷰들을 하나의 문자열(context)로 합치기
    const context = results
      .map(([doc]) => doc.pageContent)
      .join('\n\n');

    // 3. LLM 설정 (gpt-5-nano)
    const chat = new ChatOpenAI({
      model: 'gpt-5-nano',
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 4. 프롬프트 템플릿: system(역할 정의) + human(사용자 질문)
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', SYSTEM_TEMPLATE],
      ['human', '{input}'],
    ]);

    // 5. LCEL 체인: 프롬프트 → LLM → 텍스트 추출
    const chain = prompt.pipe(chat).pipe(new StringOutputParser());

    // 6. 체인 실행: context(검색된 리뷰)와 input(질문)을 넣어 답변 생성
    const answer = await chain.invoke({
      context,
      input: query,
    });

    // 7. 출처 리뷰 포맷팅 (SourceCard용)
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
      text: answer,
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