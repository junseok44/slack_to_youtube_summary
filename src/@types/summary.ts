export interface CaptionItem {
  start: number;
  dur: number;
  text: string;
}

export interface TimelineItem {
  title: string;
  startTime: string;
  startSeconds: number;
  summary: string[]; // summary를 배열로 변경
  script: string;
  icon?: string;
}

export interface SummaryData {
  mainTopics: string;
  totalSummary: string[]; // 새로 추가된 필드
  timeline: TimelineItem[];
}
