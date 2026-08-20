-- 테이블 생성
CREATE TABLE IF NOT EXISTS public.reviews (
    id bigint PRIMARY KEY,
    rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text NOT NULL,
    content text NOT NULL,
    author text NOT NULL,
    date date NOT NULL,
    helpful_votes integer DEFAULT 0,
    verified_purchase boolean DEFAULT false
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 익명 사용자(로그인 안 한 사용자)가 데이터를 읽을 수 있도록 허용하는 정책
CREATE POLICY "Allow public read access for reviews"
ON public.reviews
FOR SELECT
TO public, anon
USING (true);

-- INSERT 정책: anon/public이 데이터를 삽입할 수 있도록 허용
-- INSERT에는 USING이 아닌 WITH CHECK를 사용해야 함
CREATE POLICY "Allow public insert for indexing"
ON public.reviews
FOR INSERT
TO public, anon
WITH CHECK (true);

-- UPDATE 정책: upsert(INSERT + UPDATE)를 위해 필요
CREATE POLICY "Allow public update for indexing"
ON public.reviews
FOR UPDATE
TO public, anon
USING (true)
WITH CHECK (true);
