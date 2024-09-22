import express from "express";
import { processYoutubeSummary } from "../services/processYoutubeSummary";
import { saveSummaryToFile } from "../utils/saveSummaryToFile"; // 파일 저장 유틸리티
import Summary from "../models/summary";

const router = express.Router();

router.post("/summarize", async (req, res) => {
  const { youtubeUrl } = req.body;

  console.log(`${youtubeUrl} 요청을 처리하는 중입니다....`);
  try {
    const { videoInfo, summaryData } = await processYoutubeSummary(youtubeUrl);

    if (!summaryData) throw new Error("요약 데이터가 없습니다.");

    // JSON 데이터를 파일에 저장
    saveSummaryToFile(summaryData, videoInfo);

    const newSummary = new Summary({
      mainTopics: summaryData.mainTopics,
      totalSummary: summaryData.totalSummary, // 새로 추가된 필드
      timeline: summaryData.timeline,
      videoId: videoInfo.videoId,
    });

    await newSummary.save();

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
