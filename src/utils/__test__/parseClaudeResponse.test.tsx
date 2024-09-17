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

  it("should parse valid JSON response correctly version 2", () => {
    const validResponse = `
    여기에 요청하신 대로 JSON 형식으로 영상의 내용을 요약하여 제공하겠습니다:
    \`\`\`json
    {
      "mainTopics": "OpenAI의 GPT-5 모델 소개 및 다른 AI 모델들과의 성능 비교 테스트 자동화 과정",
      "timeline": [
        {
          "title": "GPT-5 모델 소개 및 특징",
          "startTime": "00:00:00",
          "startSeconds": 0,
          "summary": [
            "OpenAI에서 새로운 GPT-5 모델이 출시되었음",
            "GPT-5는 이전 모델들에 비해 추론 능력, 수학 및 코딩 분야에서 뛰어난 성능을 보임",
            "복잡한 문제 해결 능력과 자기반성 능력이 향상됨",
            "GPT-5는 Preview와 Mini 두 가지 버전으로 제공됨"
          ],
          "icon": "🚀"
        }
      ]
    }
    \`\`\`
    `;

    const result = parseClaudeResponse(validResponse);

    expect(result).toEqual({
      mainTopics:
        "OpenAI의 GPT-5 모델 소개 및 다른 AI 모델들과의 성능 비교 테스트 자동화 과정",
      timeline: [
        {
          title: "GPT-5 모델 소개 및 특징",
          startTime: "00:00:00",
          startSeconds: 0,
          summary: [
            "OpenAI에서 새로운 GPT-5 모델이 출시되었음",
            "GPT-5는 이전 모델들에 비해 추론 능력, 수학 및 코딩 분야에서 뛰어난 성능을 보임",
            "복잡한 문제 해결 능력과 자기반성 능력이 향상됨",
            "GPT-5는 Preview와 Mini 두 가지 버전으로 제공됨",
          ],
          icon: "🚀",
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
