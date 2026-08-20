import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { supabase } from '@/lib/supabase';
import { getPineconeIndex, getEmbeddings } from '@/lib/pinecone';

export async function POST() {
  try {
    // 1. CSV 파싱
    const filePath = path.join(process.cwd(), 'samples', 'review.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`[INDEX] CSV 로드 완료: ${records.length}건`);

    // 2. Supabase DB에 저장
    const supabaseData = records.map((record: any) => ({
      id: parseInt(record.id, 10),
      rating: parseInt(record.rating, 10),
      title: record.title,
      content: record.content,
      author: record.author,
      date: record.date,
      helpful_votes: parseInt(record.helpful_votes, 10),
      verified_purchase: record.verified_purchase === 'true',
    }));

    const { error: supabaseError } = await supabase
      .from('reviews')
      .upsert(supabaseData, { onConflict: 'id' });

    if (supabaseError) {
      console.error('[INDEX] Supabase 에러:', supabaseError);
    } else {
      console.log('[INDEX] Supabase 저장 완료');
    }

    // 3. 텍스트 준비 (제목 + 내용)
    const texts = records.map(
      (record: any) => `${record.title}\n${record.content}`
    );

    // 4. OpenAI로 임베딩 생성 (100건 한 번에)
    const embeddings = getEmbeddings();
    console.log('[INDEX] 임베딩 생성 시작');
    const vectors = await embeddings.embedDocuments(texts);
    console.log(`[INDEX] 임베딩 생성 완료: ${vectors.length}건, 차원 ${vectors[0]?.length}`);

    // 5. Pinecone 레코드 구성 (id + 벡터 + 메타데이터)
    const pineconeRecords = records.map((record: any, i: number) => ({
      id: String(record.id),
      values: vectors[i],
      metadata: {
        text: texts[i], // 검색 시 pageContent로 복원되는 필드
        title: record.title,
        rating: parseInt(record.rating, 10),
        author: record.author,
        date: record.date,
        verified_purchase: record.verified_purchase === 'true',
      },
    }));

    console.log(`[INDEX] Pinecone 레코드 구성: ${pineconeRecords.length}건`);

    // 6. Pinecone SDK로 직접 업로드 (50건씩 배치)
    const index = getPineconeIndex();
    const BATCH_SIZE = 50;
    for (let i = 0; i < pineconeRecords.length; i += BATCH_SIZE) {
      const batch = pineconeRecords.slice(i, i + BATCH_SIZE);
      await index.upsert({ records: batch });
      console.log(`[INDEX] 배치 업로드: ${i + batch.length}/${pineconeRecords.length}`);
    }

    console.log(`[INDEX] Pinecone 인덱싱 완료: ${records.length}건`);

    return NextResponse.json({
      success: true,
      message: `${records.length}건의 리뷰 데이터가 인덱싱되었습니다.`,
      count: records.length,
    });
  } catch (error: any) {
    console.error('[INDEX ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to index data', details: error.message },
      { status: 500 }
    );
  }
}