import { ProductInfo, PresetQuestion, ChatMessageItem, DashboardData } from '@/types/chat';

export const CURRENT_PRODUCT: ProductInfo = {
  id: 'omron-hem-7156t',
  name: '오므론 HEM-7156T',
  model: 'HEM-7156T',
  description: 'Upper Arm Blood Pressure Monitor with IntelliWrap 360° Cuff.',
  totalReviews: 1248,
  averageRating: 4.8,
  sentiment: {
    positive: 85,
    neutral: 10,
    negative: 5,
  },
};

export const PRESET_QUESTIONS: PresetQuestion[] = [
  {
    id: 'q1',
    question: '"병원에서 잰 혈압이랑 차이가 많이 나나요?"',
    category: '정확도 리뷰 분석',
    iconName: 'pulse',
  },
  {
    id: 'q2',
    question: '"커프 착용이 어렵진 않나요?"',
    category: '사용 편의성 리뷰 분석',
    iconName: 'user',
  },
  {
    id: 'q3',
    question: '"어르신이 쓰기에 화면이 잘 보이나요?"',
    category: '디스플레이 가독성 리뷰 분석',
    iconName: 'eye',
  },
  {
    id: 'q4',
    question: '"스마트폰 앱 연동은 잘 되나요?"',
    category: '블루투스 연결 리뷰 분석',
    iconName: 'phone',
  },
];

// 기본 시연용 초기 대화 (chat_2.png 기반)
export const INITIAL_CONVERSATION: ChatMessageItem[] = [
  {
    id: 'msg-user-1',
    sender: 'user',
    text: '어르신들이 사용하기에 화면이 잘 보이나요?',
    timestamp: '오후 2:30',
  },
  {
    id: 'msg-ai-1',
    sender: 'ai',
    text: "네, 오므론 HEM-7156T 모델은 대형 LCD 화면을 탑재하고 있어 가독성이 매우 뛰어납니다. 사용자들의 리뷰를 분석한 결과, '글자가 커서 어르신들도 보기 편하다'는 의견이 다수였습니다.",
    timestamp: '오후 2:30',
    sources: [
      {
        id: 'rev-1',
        author: '김*수',
        rating: 5,
        relevanceScore: 0.98,
        content:
          '부모님 혈압 관리용으로 샀는데, 화면에 숫자가 엄청 크게 나와서 노안이 있으신데도 안경 없이 잘 보신다고 좋아하십니다. 사용법도 버튼 하나라 간단해요.',
      },
    ],
  },
];

// 질문 키워드에 따른 AI 응답 Mock 생성 헬퍼
export const MOCK_RESPONSES: Record<
  string,
  { text: string; sources: ChatMessageItem['sources'] }
> = {
  정확도: {
    text: '오므론 HEM-7156T의 측정 정확도에 대한 리뷰를 분석한 결과, 실제 병원 측정치와 오차 범위(±3~5mmHg 내외)가 매우 적다는 긍정적인 평가가 89% 이상이었습니다. 특히 피트커프(IntelliWrap)가 360도 전 방향에서 균일하게 혈압을 측정해주어 오차 발생이 적습니다.',
    sources: [
      {
        id: 'rev-acc-1',
        author: '이*진',
        rating: 5,
        relevanceScore: 0.96,
        content:
          '정기검진 때 병원 혈압계 수치와 비교해봤는데 거의 오차 없이 비슷하게 측정됩니다. 집에서 신뢰하고 매일 아침저녁으로 측정하고 있어요.',
      },
      {
        id: 'rev-acc-2',
        author: '박*현',
        rating: 4,
        relevanceScore: 0.92,
        content:
          '커프를 착용할 때 위치에 크게 구애받지 않고 정확하게 측정되어서 매우 만족스럽습니다.',
      },
    ],
  },
  커프: {
    text: '360° 인텔리랩 커프(원통형 피트커프)가 적용되어 혼자서도 한 손으로 간편하게 팔에 감을 수 있다는 호평이 많습니다. 커프 착용 가이드 표시등이 있어 올바르게 착용되었는지 직관적으로 확인할 수 있습니다.',
    sources: [
      {
        id: 'rev-cuff-1',
        author: '최*영',
        rating: 5,
        relevanceScore: 0.97,
        content:
          '기존 벨크로형은 혼자 감기 헐렁하거나 삐뚤어지기 쉬웠는데, 이 제품은 단단한 원통형 구조라 팔에 슥 끼우고 감기만 하면 돼서 너무 편리합니다.',
      },
    ],
  },
  화면: {
    text: "네, 오므론 HEM-7156T 모델은 대형 LCD 화면을 탑재하고 있어 가독성이 매우 뛰어납니다. 사용자들의 리뷰를 분석한 결과, '글자가 커서 어르신들도 보기 편하다'는 의견이 다수였습니다.",
    sources: [
      {
        id: 'rev-scr-1',
        author: '김*수',
        rating: 5,
        relevanceScore: 0.98,
        content:
          '부모님 혈압 관리용으로 샀는데, 화면에 숫자가 엄청 크게 나와서 노안이 있으신데도 안경 없이 잘 보신다고 좋아하십니다. 사용법도 버튼 하나라 간단해요.',
      },
    ],
  },
  스마트폰: {
    text: '오므론 커넥트(OMRON connect) 앱과의 블루투스 자동 동기화 기능은 혈압 기록과 그래프 관리에 매우 유용하다는 반응입니다. 다만 스마트폰 조작이 익숙하지 않은 고령층의 경우 초기 페어링 시 가족의 도움이 필요하다는 리뷰도 일부 있었습니다.',
    sources: [
      {
        id: 'rev-app-1',
        author: '정*우',
        rating: 5,
        relevanceScore: 0.95,
        content:
          '측정하고 앱 켜면 자동으로 블루투스 전송되어 엑셀이나 그래프로 의사 선생님께 보여드리기 너무 좋습니다. 수기 기록의 번거로움이 사라졌어요.',
      },
    ],
  },
  기본: {
    text: '오므론 HEM-7156T 실사용자 리뷰 1,248건을 분석한 결과, 전반적인 평점은 4.8점으로 측정 정확도와 원통형 커프 착용의 편리성에 대한 만족도가 가장 높게 나타났습니다.',
    sources: [
      {
        id: 'rev-gen-1',
        author: '강*민',
        rating: 5,
        relevanceScore: 0.93,
        content:
          '가정용 혈압계 중에서는 단연 최고인 것 같습니다. 측정 신뢰도와 마감 퀄리티가 만족스럽습니다.',
      },
    ],
  },
};

// 추후 대시보드(chat_3.png) 연동용 mock 데이터
export const MOCK_DASHBOARD_DATA: DashboardData = {
  product: CURRENT_PRODUCT,
  isTrendingPositive: true,
  keyThemes: [
    { id: 'theme-1', name: '측정 정확도' },
    { id: 'theme-2', name: '커프 착용' },
    { id: 'theme-3', name: '앱 연동' },
    { id: 'theme-4', name: '화면 가독성' },
  ],
  aiConfidence: 94,
  advantages: [
    {
      title: '정확한 측정',
      englishTitle: 'Accurate Measurement',
      description: 'Mentioned in 89% of positive reviews.',
    },
    {
      title: '편안한 커프',
      englishTitle: 'Comfortable Cuff',
      description: 'IntelliWrap cuff highly praised.',
    },
    {
      title: '쉬운 사용법',
      englishTitle: 'Easy to Use',
      description: 'Intuitive interface for elderly users.',
    },
  ],
  improvements: [
    {
      title: '높은 가격대',
      englishTitle: 'High Price Point',
      description: 'Considered expensive relative to basic models.',
    },
    {
      title: '앱 연동 초기 설정',
      englishTitle: 'App Setup',
      description: 'Bluetooth pairing issues reported by older demographic.',
    },
  ],
};
