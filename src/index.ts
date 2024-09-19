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
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .summary {
              max-width: 800px;
              margin: 0 auto;
            }
            h2 {
              text-align: center;
            }
            .timeline-item {
              margin-bottom: 20px;
            }
            .timeline-item h3 {
              color: #333;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 10px;
              list-style-type: disc;
            }
          </style>
        </head>
        <body>
          <div class="summary">
            <h2>${summaryData.mainTopics}</h2>
            <p><a href="${videoLink}" target="_blank">YouTube 비디오 보기</a></p>
            <ul>
              ${summaryData.timeline
                .map(
                  (item: any) => `
                <li class="timeline-item">
                  <h3>${item.title}</h3>
                  <p>시작 시간: <a href="${videoLink}&t=${convertTimeToSeconds(
                    item.startTime
                  )}" target="_blank">${item.startTime}</a></p>
                  <ul>
                    ${item.summary
                      .map((summaryPoint: string) => `<li>${summaryPoint}</li>`)
                      .join("")}
                  </ul>
                </li>
              `
                )
                .join("")}
            </ul>
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
