import processSummary from "./processSummary";
import { getCaptions, getVideoInfo } from "./youtubeService";

export const processYoutubeSummary = async (youtubeUrl: string) => {
  try {
    // 유튜브 정보 및 캡션을 가져와서 처리
    const videoInfo = await getVideoInfo(youtubeUrl);
    const captions = await getCaptions(videoInfo.videoId);

    // 캡션 및 비디오 정보를 이용해 요약 데이터 생성
    const summaryData = await processSummary(captions, videoInfo);

    return {
      videoInfo,
      summaryData,
    };
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("유튜브 요약 처리 중 오류가 발생했습니다.");
    }
  }
};
