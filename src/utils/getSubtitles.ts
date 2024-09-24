import axios from "axios";
import { getSub } from "./getSub";

// 자막 데이터의 인터페이스 정의
interface SubtitleLine {
  start: number;
  dur: number;
  text: string;
}

// 새 API에 POST 요청을 보내 자막 데이터를 가져오는 함수
const fetchSubtitles = async (videoID: string): Promise<SubtitleLine[]> => {
  try {
    const response = await axios.post(
      "https://us-west2-eo-ga4.cloudfunctions.net/youtube-transcript",
      {
        video_id: videoID,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    // API 응답에서 자막 데이터를 가져옵니다.
    const subtitles: SubtitleLine[] = response.data.map((item: any) => ({
      start: item.start,
      dur: item.duration,
      text: item.text,
    }));

    return subtitles;
  } catch (error) {
    throw new Error(
      `Failed to fetch subtitles for video: ${videoID}. Error: ${error.message}`
    );
  }
};

// 자막 데이터를 가져오는 메인 함수
export async function getSubtitles({
  videoID,
  lang = "en",
}: {
  videoID: string;
  lang?: string;
}): Promise<SubtitleLine[]> {
  // 제공된 API를 사용하여 자막 데이터를 가져옵니다.
  // return await fetchSubtitles(videoID);

  const response = await getSub({
    videoId: videoID,
  });

  if (!response) throw Error("자막을 찾을 수 없습니다.");

  return response;
}
