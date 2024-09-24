import { youtube_v3 } from "@googleapis/youtube";
import axios from "axios";
import { Buffer } from "buffer";
import protobuf from "protobufjs";

// YouTube API 클라이언트 생성
const youtubeClient = new youtube_v3.Youtube({
  auth: process.env.YOUTUBE_DATA_API_KEY,
});

/**
 * Protobuf 메시지를 base64로 인코딩하는 함수
 * @param message - 인코딩할 메시지
 * @returns - base64 인코딩된 protobuf 메시지
 */
function getBase64Protobuf(message: Record<string, any>): string {
  const root = protobuf.Root.fromJSON({
    nested: {
      Message: {
        fields: {
          param1: { id: 1, type: "string" },
          param2: { id: 2, type: "string" },
        },
      },
    },
  });
  const MessageType = root.lookupType("Message");

  const buffer = MessageType.encode(message).finish();

  return Buffer.from(buffer).toString("base64");
}

/**
 * YouTube 비디오의 기본 자막 언어를 반환하는 함수
 * @param videoId - YouTube 비디오 ID
 * @returns - 기본 자막 언어 및 자막 트랙 종류
 */
async function getDefaultSubtitleLanguage(
  videoId: string
): Promise<{ trackKind: string; language: string }> {
  // 비디오의 기본 언어 가져오기
  const videos = await youtubeClient.videos.list({
    part: ["snippet"],
    id: [videoId],
  });

  if (!videos.data.items || videos.data.items.length !== 1) {
    throw new Error(`Multiple or no videos found for video: ${videoId}`);
  }

  const preferredLanguage =
    videos.data.items[0].snippet?.defaultLanguage ||
    videos.data.items[0].snippet?.defaultAudioLanguage;

  // 자막 목록 가져오기
  const subtitles = await youtubeClient.captions.list({
    part: ["snippet"],
    videoId: videoId,
  });

  if (!subtitles.data.items || subtitles.data.items.length < 1) {
    throw new Error(`No subtitles found for video: ${videoId}`);
  }

  const { trackKind, language } =
    subtitles.data.items.find(
      (sub) => sub.snippet?.language === preferredLanguage
    )?.snippet || subtitles.data.items[0].snippet;

  return { trackKind, language };
}

/**
 * 텍스트를 추출하는 헬퍼 함수
 * @param item - 추출할 요소
 * @returns - 추출된 텍스트
 */
function extractText(item: any): string {
  return (
    item.simpleText ||
    item.runs?.map((run: { text: string }) => run.text).join("")
  );
}

/**
 * 주어진 YouTube 비디오의 자막을 가져오는 함수
 * @param options - 비디오 ID, 자막 트랙 종류 및 언어
 * @returns - 자막 데이터 배열
 */
async function getSubtitles({
  videoId,
  trackKind,
  language,
}: {
  videoId: string;
  trackKind: string;
  language: string;
}): Promise<Array<{ start: number; dur: number; text: string }>> {
  const message = {
    param1: videoId,
    param2: getBase64Protobuf({
      // 자동 생성된 자막일 경우에만 `trackKind` 포함
      param1: trackKind === "asr" ? trackKind : null,
      param2: language,
    }),
  };

  const params = getBase64Protobuf(message);

  const url = "https://www.youtube.com/youtubei/v1/get_transcript";
  const headers = { "Content-Type": "application/json" };
  const data = {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20240826.01.00",
      },
    },
    params,
  };

  const response = await axios.post(url, data, { headers });

  const initialSegments =
    response.data.actions[0].updateEngagementPanelAction.content
      .transcriptRenderer.content.transcriptSearchPanelRenderer.body
      .transcriptSegmentListRenderer.initialSegments;

  if (!initialSegments) {
    throw new Error(
      `Requested transcript does not exist for video: ${videoId}`
    );
  }

  const output = initialSegments.map((segment: any) => {
    const line =
      segment.transcriptSectionHeaderRenderer ||
      segment.transcriptSegmentRenderer;

    const { endMs, startMs, snippet } = line;

    const text = extractText(snippet);

    return {
      start: parseInt(startMs) / 1000,
      dur: (parseInt(endMs) - parseInt(startMs)) / 1000,
      text,
    };
  });

  return output;
}

/**
 * 비디오 ID를 통해 자막을 가져오는 함수
 * @param videoId - YouTube 비디오 ID
 */
export async function getSub({ videoId }: { videoId: string }) {
  try {
    const { language, trackKind } = await getDefaultSubtitleLanguage(videoId);

    const subtitles = await getSubtitles({
      language,
      trackKind,
      videoId,
    });

    return subtitles;
  } catch (err) {
    console.error("Error:", err);
  }
}

// 비디오 자막 가져오기 예시 실행
// getSub({ videoId: "pyX8kQ-JzHI" });
// getSub({ videoId: "-16RFXr44fY" });
// getSub({ videoId: "qwQwSTWHTAY" });
