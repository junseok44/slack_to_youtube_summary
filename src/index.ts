// src/index.ts
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path"; // 경로 모듈 추가
import processSummary from "./services/processSummary";
import { getCaptions, getVideoInfo } from "./services/youtubeService";
import { saveToFile } from "./utils/saveToFile";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.post("/api/summarize", async (req, res) => {
  const { youtubeUrl } = req.body;

  console.log(youtubeUrl + " 요청을 처리하는 중입니다....");
  try {
    const videoInfo = await getVideoInfo(youtubeUrl);

    console.log(videoInfo.title, "의 비디오 정보를 성공적으로 가져왔습니다.");

    const captions = await getCaptions(videoInfo.videoId);

    console.log(videoInfo.title, "요약을 생성하는 중입니다....");

    // 3. 요약 생성 (항상 한국어로)
    const summaryData = await processSummary(captions, videoInfo);

    if (!summaryData) throw new Error("요약 데이터가 없습니다.");

    const directoryPath = path.join(__dirname, "../../summary"); // 파일 경로 지정

    const fileName = `${videoInfo.title
      .slice(0, 12)
      .replace("/", "")}_summary.json`; // 파일 이름 지정

    // JSON 데이터를 파일에 저장
    saveToFile(directoryPath, fileName, summaryData);

    // 4. Notion 페이지 생성
    // const notionUrl = await createNotionPage(
    //   videoInfo,
    //   youtubeUrl,
    //   summaryData
    // );

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
