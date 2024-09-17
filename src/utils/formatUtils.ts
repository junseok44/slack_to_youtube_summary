// 유튜브 링크 추출 함수
export function extractYoutubeUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches ? matches[0] : null;
}

// 요약 데이터를 사람이 읽기 쉬운 형태로 변환하는 함수
export function formatSummary(summaryData: any): string {
  // summaryData의 timeline 배열을 순회하면서 각 타이틀과 서머리 리스트를 포맷합니다.
  return summaryData.timeline
    .map((item: any) => {
      // 각 타이틀에 해당하는 summary 항목들을 포맷
      const summaries = item.summary
        .map((summary: string) => `- ${summary}`)
        .join("\n");
      return `${item.title}\n${summaries}`; // 타이틀과 서머리 리스트를 합침
    })
    .join("\n\n"); // 타이틀 간에 간격 추가
}
