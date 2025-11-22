export enum SentimentType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral',
}

export interface AnalysisResult {
  sentiment: SentimentType;
  score: number; // 0 to 100
  reasoning: string;
  emotions: string[];
  keywords: string[];
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  text: string;
  timestamp: number;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';