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
  timeline: ITimelineItem[];
  videoId: string;
}

// Mongoose 스키마 정의
const SummarySchema: Schema = new Schema({
  mainTopics: { type: String, required: true },
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
});

export default mongoose.model<ISummary>("Summary", SummarySchema);
