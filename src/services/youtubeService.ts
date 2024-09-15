// src/services/youtubeService.ts
import dotenv from "dotenv";
import { google } from "googleapis";
import { getSubtitles } from "youtube-captions-scraper";

dotenv.config();

const youtube = google.youtube("v3");
const API_KEY = process.env.YOUTUBE_API_KEY;

export async function getVideoInfo(
  youtubeUrl: string
): Promise<{ title: string; description: string; videoId: string }> {
  const videoId = extractVideoId(youtubeUrl);

  const response = await youtube.videos.list({
    key: API_KEY,
    part: ["snippet"],
    id: [videoId],
  });

  const video = response.data.items?.[0];

  if (!video) {
    throw new Error("영상을 찾을 수 없습니다.");
  }

  return {
    title: video.snippet?.title || "제목 없음",
    description: video.snippet?.description || "",
    videoId,
  };
}

export async function getCaptions(videoId: string): Promise<string> {
  const languages = ["ko", "en"]; // 우선순위로 언어 설정: 한국어, 영어

  for (const lang of languages) {
    try {
      // 자막 가져오기
      const captions = await getSubtitles({
        videoID: videoId,
        lang: lang,
      });

      if (captions && captions.length > 0) {
        // 자막 텍스트 추출 및 시간 정보 저장
        const captionsTextArray = captions.map((caption: any) => ({
          start: caption.start,
          dur: caption.duration,
          text: caption.text.replace(/<[^>]+>/g, ""), // 태그 제거
        }));

        return JSON.stringify(captionsTextArray);
      }
    } catch (error: any) {
      console.warn(
        `언어 '${lang}' 자막을 가져오는 중 오류 발생:`,
        error.message
      );
      // 다음 언어로 시도
    }
  }

  // 모든 언어에서 자막을 찾을 수 없는 경우
  throw new Error("한국어 및 영어 자막을 찾을 수 없습니다.");
}

function extractVideoId(url: string): string {
  const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error("유효한 YouTube URL이 아닙니다.");
  }
}
