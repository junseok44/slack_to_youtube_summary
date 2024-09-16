// src/index.ts
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import slackRoutes from "./routes/slackRoutes";
import summarizeRoutes from "./routes/summarizeRoutes";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use("/slack", slackRoutes);

app.use("/api", summarizeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
