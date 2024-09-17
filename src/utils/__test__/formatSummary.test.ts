// formatSummary.test.ts

import { formatSummary } from "../formatUtils";

describe("formatSummary", () => {
  it("should format summary data correctly", () => {
    const summaryData = {
      mainTopics:
        "성공적인 마케터가 되기 위한 문제 해결 능력과 접근 방식에 대한 인사이트",
      timeline: [
        {
          title: "성공적인 마케터의 경력 소개",
          startTime: "00:00:00",
          startSeconds: 0,
          summary: [
            "PNG에서 커리어를 시작해 29살에 팀장 역할 수행",
            "코스, 샌드박스 등 유명 기업들을 거쳐 현재 무신사 29cm에서 마케팅 팀장으로 근무 중",
            "여러 유명 기업들을 거치며 '일잘러'로 인정받음",
            "성공의 핵심 요인으로 '문제 정의와 해결 능력'을 강조",
          ],
          icon: "🚀",
        },
        {
          title: "문제 해결 접근법: 경우의 수와 인수분해",
          startTime: "00:02:30",
          startSeconds: 150,
          summary: [
            "경우의 수와 인수분해를 통해 현상을 단순하게 이해하는 것이 중요",
            "원하는 결과에 연결될 수 있는 여러 시나리오를 매칭하는 것이 경우의 수",
            "각 시나리오를 구성요소로 분해하는 것이 인수분해",
            "이를 통해 문제의 원인을 정확히 파악하고 해결책을 찾을 수 있음",
            "MECE(Mutually Exclusive Collectively Exhaustive) 방식으로 누락이나 중복 없이 분석",
          ],
          icon: "🧮",
        },
      ],
    };

    const expectedOutput = `성공적인 마케터의 경력 소개
- PNG에서 커리어를 시작해 29살에 팀장 역할 수행
- 코스, 샌드박스 등 유명 기업들을 거쳐 현재 무신사 29cm에서 마케팅 팀장으로 근무 중
- 여러 유명 기업들을 거치며 '일잘러'로 인정받음
- 성공의 핵심 요인으로 '문제 정의와 해결 능력'을 강조

문제 해결 접근법: 경우의 수와 인수분해
- 경우의 수와 인수분해를 통해 현상을 단순하게 이해하는 것이 중요
- 원하는 결과에 연결될 수 있는 여러 시나리오를 매칭하는 것이 경우의 수
- 각 시나리오를 구성요소로 분해하는 것이 인수분해
- 이를 통해 문제의 원인을 정확히 파악하고 해결책을 찾을 수 있음
- MECE(Mutually Exclusive Collectively Exhaustive) 방식으로 누락이나 중복 없이 분석`;

    const result = formatSummary(summaryData);
    expect(result).toBe(expectedOutput);
  });

  it("should return an empty string if timeline is empty", () => {
    const summaryData = {
      mainTopics: "Empty timeline",
      timeline: [],
    };

    const expectedOutput = "";
    const result = formatSummary(summaryData);
    expect(result).toBe(expectedOutput);
  });

  it("should handle missing summary field gracefully", () => {
    const summaryData = {
      mainTopics: "Missing summary",
      timeline: [
        {
          title: "Empty Summary",
          startTime: "00:00:00",
          startSeconds: 0,
          summary: [],
          icon: "🚀",
        },
      ],
    };

    const expectedOutput = `Empty Summary\n`; // 타이틀만 출력됨
    const result = formatSummary(summaryData);
    expect(result).toBe(expectedOutput);
  });
});
