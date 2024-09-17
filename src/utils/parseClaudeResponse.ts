import { SummaryData } from "../@types/summary";

export function parseClaudeResponse(response: string): SummaryData | null {
  try {
    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "");

    const jsonMatch = cleanedResponse.match(/\{\s*[\s\S]*\s*\}/);

    if (!jsonMatch) {
      throw new Error("AI 응답에서 JSON 부분을 찾을 수 없습니다.");
    }

    const jsonString = jsonMatch[0];
    const summaryData: SummaryData = JSON.parse(jsonString);

    return summaryData;
  } catch (error) {
    console.log(error, response);
    throw new Error("AI 응답을 파싱하는 중 오류가 발생했습니다.");
  }
}
