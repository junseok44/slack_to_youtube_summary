import { parseClaudeResponse } from "../utils/parseClaudeResponse";
import { summarizeText } from "./claudeService";

async function processSummary(captions: string, videoInfo: { title: string }) {
  try {
    let response = await summarizeText(captions);

    console.log(response);

    if (!response) {
      throw new Error("요약 데이터가 없습니다.");
    }

    let data = parseClaudeResponse(response);

    if (!data) {
      throw new Error("요약 데이터를 파싱할 수 없습니다.");
    }

    return data;
  } catch (error) {
    console.error("요약 데이터 생성 중 오류가 발생했습니다:", error);
  }
}

export default processSummary;
