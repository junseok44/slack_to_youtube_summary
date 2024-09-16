// 유튜브 링크 추출 함수
export function extractYoutubeUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? matches[0] : null;
}

// 요약 데이터를 사람이 읽기 쉬운 형태로 변환하는 함수
export function formatSummary(summaryData: any): string {
  // 예시: 간단한 텍스트 변환
  return summaryData.items
    .map((item: any) => `- ${item.title}: ${item.description}`)
    .join("\n");
}
