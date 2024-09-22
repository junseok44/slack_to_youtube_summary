// src/index.ts
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import slackRoutes from "./routes/slackRoutes";
import summarizeRoutes from "./routes/summarizeRoutes";
import connectDB from "./config/db"; // DB 연결 파일 import
import summary from "./models/summary";
import { convertTimeToSeconds } from "./utils/convertTimeToSeconds";

dotenv.config();

const app = express();

connectDB();

app.use(bodyParser.json());

app.use("/slack", slackRoutes);

app.use("/api", summarizeRoutes);

app.get("/summary/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const summaryData = await summary.findById(id);

    if (!summaryData) {
      return res.status(404).send("요약 데이터를 찾을 수 없습니다.");
    }

    // YouTube 비디오 링크 생성
    const videoLink = `https://www.youtube.com/watch?v=${summaryData.videoId}`;

    res.send(`
      <html>
        <head>
          <title>요약 보기</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
            
            body {
              font-family: "Nanum Myeongjo", serif;
              font-weight: 400;
              line-height: 1.4;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              font-size: 16px;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            .summary {
              background-color: #fff;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 30px;
            }
            .main-summary {
              background-color: #f0f0f0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 30px;
              font-family: "Nanum Myeongjo", serif;
            }
            .main-summary h2 {
              font-weight: 700;
              font-size: 1.2em;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            .main-summary ul {
              padding-left: 20px;
              margin: 0;
            }
            .main-summary li {
              margin-bottom: 5px;
            }
            h1 {
              font-family: "Nanum Myeongjo", serif;
              font-weight: 800;
              font-size: 2.2em;
              margin-bottom: 15px;
              color: #2c3e50;
              text-align: center;
            }
            .video-link {
              display: inline-block;
              margin-bottom: 20px;
              color: #3498db;
              text-decoration: none;
              font-weight: 700;
            }
            .video-link:hover {
              text-decoration: underline;
            }
            .timeline-item {
              margin-bottom: 40px;
              border-left: 3px solid #3498db;
              padding-left: 15px;
            }
            .timeline-item h2 {
              font-family: "Nanum Myeongjo", serif;
              font-weight: 700;
              font-size: 1.3em;
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .timeline-item .time {
              font-size: 0.9em;
              color: #7f8c8d;
              margin-bottom: 5px;
            }
            .timeline-item ul {
              padding-left: 20px;
              margin-top: 5px;
            }
            .timeline-item li {
              margin-bottom: 5px;
            }
            @media (max-width: 1300px) {
              .container {
                width: 95%;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="summary">
              <h1>${summaryData.mainTopics}</h1>
              <a href="${videoLink}" target="_blank" class="video-link">YouTube 비디오 보기</a>
              ${
                summaryData.totalSummary && summaryData.totalSummary.length > 0
                  ? `
                <div class="main-summary">
                  <h2>주요 요약</h2>
                  <ul>
                    ${summaryData.totalSummary
                      .map((item: string) => `<li>${item}</li>`)
                      .join("")}
                  </ul>
                </div>
              `
                  : ""
              }
              ${summaryData.timeline
                .map(
                  (item: any) => `
                <div class="timeline-item">
                  <h2>${item.title}</h2>
                  <div class="time">
                    시작 시간: <a href="${videoLink}&t=${convertTimeToSeconds(
                    item.startTime
                  )}" target="_blank">${item.startTime}</a>
                  </div>
                  <ul>
                    ${item.summary
                      .map((summaryPoint: string) => `<li>${summaryPoint}</li>`)
                      .join("")}
                  </ul>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).send("서버에서 데이터를 가져오는 중 오류가 발생했습니다.");
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
