import { CaptionItem } from "../@types/summary";

export function groupCaptions(
  captionsArray: CaptionItem[],
  groupSize: number = 10
): string {
  const groupedCaptions = [];
  for (let i = 0; i < captionsArray.length; i += groupSize) {
    const group = captionsArray.slice(i, i + groupSize);
    const timeline = group[0].start;
    const text = group.map((item) => item.text).join(" ");
    groupedCaptions.push(`${timeline}: ${text}`);
  }
  return groupedCaptions.join(" ");
}
