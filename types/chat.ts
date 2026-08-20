export interface SourceReview {
  id: string;
  author: string;
  rating: number; // 1 to 5
  content: string;
  relevanceScore: number; // Pinecone 유사도 점수 (0.00 ~ 1.00)
  date?: string;
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: SourceReview[];
}

export interface ProductInfo {
  id: string;
  name: string;
  model: string;
  description: string;
  totalReviews: number;
  averageRating: number;
  sentiment: {
    positive: number; // e.g. 85
    neutral: number;  // e.g. 10
    negative: number; // e.g. 5
  };
}

export interface PresetQuestion {
  id: string;
  question: string;
  category: string;
  iconName: 'pulse' | 'user' | 'eye' | 'phone';
}

// 추후 대시보드(chat_3.png) 연동을 위한 타입
export interface ReviewSummaryTheme {
  id: string;
  name: string;
}

export interface AdvantageItem {
  title: string;
  englishTitle?: string;
  description: string;
}

export interface ImprovementItem {
  title: string;
  englishTitle?: string;
  description: string;
}

export interface DashboardData {
  product: ProductInfo;
  isTrendingPositive: boolean;
  keyThemes: ReviewSummaryTheme[];
  aiConfidence: number; // e.g. 94
  advantages: AdvantageItem[];
  improvements: ImprovementItem[];
}
