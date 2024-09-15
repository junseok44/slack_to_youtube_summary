// src/services/notionService.ts
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

interface VideoInfo {
  title: string;
  description: string;
  videoId: string;
}

interface TimelineItem {
  title: string;
  startTime: string;
  startSeconds: number;
  summary: string;
  script: string;
  icon?: string;
}

interface SummaryData {
  mainTopics: string;
  timeline: TimelineItem[];
}

export async function createNotionPage(
  videoInfo: VideoInfo,
  youtubeUrl: string,
  summaryData: SummaryData
): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: NOTION_DATABASE_ID },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: videoInfo.title,
            },
          },
        ],
      },
    },
    children: [
      // 영상 임베드 블록 추가
      {
        object: "block",
        type: "embed",
        embed: {
          url: youtubeUrl,
        },
      },
      // 핵심 주제 추가
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "핵심 주제" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: summaryData.mainTopics } },
          ],
        },
      },
      // 목차 및 타임라인 추가
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "타임라인" } }],
        },
      },
      ...createTimelineBlocks(summaryData.timeline, videoInfo.videoId),
    ],
  });

  return response.url;
}

function createTimelineBlocks(
  timelineData: TimelineItem[],
  videoId: string
): any[] {
  const blocks: any[] = [];

  for (const item of timelineData) {
    const youtubeTimestampUrl = `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(
      item.startSeconds
    )}s`;

    // 타임라인 항목 제목
    blocks.push({
      object: "block",
      type: "heading_3",
      heading_3: {
        rich_text: [
          {
            type: "text",
            text: {
              content: `${item.icon || ""} ${item.title} (${item.startTime})`,
              link: {
                url: youtubeTimestampUrl,
              },
            },
          },
        ],
      },
    });

    // 요약 내용
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [{ type: "text", text: { content: item.summary } }],
      },
    });

    // 스크립트 원문 (토글 블록)
    blocks.push({
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [{ type: "text", text: { content: "스크립트 원문 보기" } }],
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [{ type: "text", text: { content: item.script } }],
            },
          },
        ],
      },
    });
  }

  return blocks;
}
