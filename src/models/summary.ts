import mongoose, { Schema, Document } from "mongoose";

// 요약 데이터의 TypeScript 인터페이스
export interface ICaptionItem {
  start: number;
  dur: number;
  text: string;
}

export interface ITimelineItem {
  title: string;
  startTime: string;
  startSeconds: number;
  summary: string[];
  script: string;
  icon?: string;
}

export interface ISummary extends Document {
  mainTopics: string;
  totalSummary: string[];
  timeline: ITimelineItem[];
  videoId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose 스키마 정의
const SummarySchema: Schema = new Schema(
  {
    mainTopics: { type: String, required: true },
    totalSummary: [{ type: String, required: true }],
    timeline: [
      {
        title: { type: String, required: true },
        startTime: { type: String, required: true },
        startSeconds: { type: Number, required: true },
        summary: [{ type: String, required: true }],
        icon: { type: String },
      },
    ],
    videoId: { type: String, required: true },
  },
  { timestamps: true }
); // 이 옵션을 추가합니다

export default mongoose.model<ISummary>("Summary", SummarySchema);
