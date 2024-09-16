import express from "express";
import processSummary from "../services/processSummary";
import { getCaptions, getVideoInfo } from "../services/youtubeService";
import { saveSummaryToFile } from "../utils/saveSummaryToFile"; // 파일 저장 유틸리티

const router = express.Router();

router.post("/summarize", async (req, res) => {
  const { youtubeUrl } = req.body;

  console.log(`${youtubeUrl} 요청을 처리하는 중입니다....`);
  try {
    const videoInfo = await getVideoInfo(youtubeUrl);
    const captions = await getCaptions(videoInfo.videoId);
    const summaryData = await processSummary(captions, videoInfo);

    if (!summaryData) throw new Error("요약 데이터가 없습니다.");

    // JSON 데이터를 파일에 저장
    saveSummaryToFile(summaryData, videoInfo);

    res.json({
      summaryData,
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ error: error.message || "요약 생성 중 오류가 발생했습니다." });
  }
});

export default router;
