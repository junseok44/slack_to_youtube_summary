// src/utils/saveSummaryToFile.ts
import path from "path";
import { saveToFile } from "./saveToFile";

export const saveSummaryToFile = (
  summaryData: any,
  videoInfo: { title: string }
) => {
  const directoryPath = path.join(__dirname, "../../summary"); // 파일 경로 지정
  const fileName = `${videoInfo.title
    .slice(0, 12)
    .replace("/", "")}_summary.json`; // 파일 이름 지정
  // JSON 데이터를 파일에 저장
  saveToFile(directoryPath, fileName, summaryData);
};
