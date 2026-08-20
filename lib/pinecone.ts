import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

const INDEX_NAME = 'review-chatbot';

/** Pinecone 인덱스 참조 */
export function getPineconeIndex() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  return pc.Index(INDEX_NAME);
}

/** OpenAI text-embedding-3-small 기반 임베딩 인스턴스 */
export function getEmbeddings() {
  return new OpenAIEmbeddings({
    model: 'text-embedding-3-small',
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

/** 기존 Pinecone 인덱스에서 LangChain VectorStore 로드 */
export async function getVectorStore() {
  return PineconeStore.fromExistingIndex(getEmbeddings(), {
    pineconeIndex: getPineconeIndex(),
  });
}

export { INDEX_NAME };
