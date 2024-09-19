import { CaptionItem } from "../../@types/summary";
import { groupCaptions } from "../groupCaptions";

describe("groupCaptions", () => {
  it("그룹 크기가 10인 경우 정확히 그룹화합니다", () => {
    const captions: CaptionItem[] = Array(30)
      .fill(null)
      .map((_, i) => ({
        start: i,
        text: `텍스트 ${i + 1}`,
        dur: 1,
      }));

    const result = groupCaptions(captions);
    const expected =
      "0: 텍스트 1 텍스트 2 텍스트 3 텍스트 4 텍스트 5 텍스트 6 텍스트 7 텍스트 8 텍스트 9 텍스트 10 10: 텍스트 11 텍스트 12 텍스트 13 텍스트 14 텍스트 15 텍스트 16 텍스트 17 텍스트 18 텍스트 19 텍스트 20 20: 텍스트 21 텍스트 22 텍스트 23 텍스트 24 텍스트 25 텍스트 26 텍스트 27 텍스트 28 텍스트 29 텍스트 30";

    expect(result).toBe(expected);
  });

  it("캡션 수가 그룹 크기의 배수가 아닌 경우 마지막 그룹을 올바르게 처리합니다", () => {
    const captions: CaptionItem[] = Array(25)
      .fill(null)
      .map((_, i) => ({
        start: i,
        text: `텍스트 ${i + 1}`,
        dur: 1,
      }));

    const result = groupCaptions(captions);
    const expected =
      "0: 텍스트 1 텍스트 2 텍스트 3 텍스트 4 텍스트 5 텍스트 6 텍스트 7 텍스트 8 텍스트 9 텍스트 10 10: 텍스트 11 텍스트 12 텍스트 13 텍스트 14 텍스트 15 텍스트 16 텍스트 17 텍스트 18 텍스트 19 텍스트 20 20: 텍스트 21 텍스트 22 텍스트 23 텍스트 24 텍스트 25";

    expect(result).toBe(expected);
  });

  it("사용자 정의 그룹 크기를 처리합니다", () => {
    const captions: CaptionItem[] = Array(15)
      .fill(null)
      .map((_, i) => ({
        start: i,
        text: `텍스트 ${i + 1}`,
        dur: 1,
      }));

    const result = groupCaptions(captions, 5);
    const expected =
      "0: 텍스트 1 텍스트 2 텍스트 3 텍스트 4 텍스트 5 5: 텍스트 6 텍스트 7 텍스트 8 텍스트 9 텍스트 10 10: 텍스트 11 텍스트 12 텍스트 13 텍스트 14 텍스트 15";

    expect(result).toBe(expected);
  });
});
