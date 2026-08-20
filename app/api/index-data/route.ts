import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Document } from '@langchain/core/documents';
import { PineconeStore } from '@langchain/pinecone';
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
      // Supabase 실패해도 Pinecone 인덱싱은 계속 진행
    } else {
      console.log('[INDEX] Supabase 저장 완료');
    }

    // 3. LangChain Document 생성
    const docs = records.map((record: any) => {
      return new Document({
        pageContent: `${record.title}\n${record.content}`,
        metadata: {
          id: record.id,
          title: record.title,
          content: record.content,
          rating: parseInt(record.rating, 10),
          author: record.author,
          date: record.date,
          verified_purchase: record.verified_purchase === 'true',
        },
      });
    });

    // 4. OpenAI 임베딩 + PineconeStore로 인덱싱
    const pineconeIndex = getPineconeIndex();
    const embeddings = getEmbeddings();

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      maxConcurrency: 5,
    });

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
