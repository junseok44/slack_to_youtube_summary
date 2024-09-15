import { parseClaudeResponse } from "../parseClaudeResponse";

describe("parseClaudeResponse", () => {
  it("should parse valid JSON response correctly", () => {
    const validResponse = `
    Some text before JSON
    {
      "mainTopics": "주요 주제",
      "timeline": [
        {
          "title": "섹션 1",
          "startTime": "00:00:01",
          "startSeconds": 1,
          "summary": ["포인트 1", "포인트 2"],
          "script": "스크립트 원문",
          "icon": "🎓"
        }
      ]
    }`;

    const result = parseClaudeResponse(validResponse);
    expect(result).toEqual({
      mainTopics: "주요 주제",
      timeline: [
        {
          title: "섹션 1",
          startTime: "00:00:01",
          startSeconds: 1,
          summary: ["포인트 1", "포인트 2"],
          script: "스크립트 원문",
          icon: "🎓",
        },
      ],
    });
  });

  it("should throw error for response without JSON", () => {
    const invalidResponse = "No JSON here";

    expect(() => parseClaudeResponse(invalidResponse)).toThrow(
      "AI 응답을 파싱하는 중 오류가 발생했습니다."
    );
  });

  it("should return null for invalid JSON format", () => {
    const invalidJsonResponse = `
    Some text before JSON
    { invalid json here }`;

    expect(() => parseClaudeResponse(invalidJsonResponse)).toThrow(
      "AI 응답을 파싱하는 중 오류가 발생했습니다."
    );
  });
});
