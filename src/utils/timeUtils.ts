// src/utils/timeUtils.ts

export function secondsToTimeFormat(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const hStr = h > 0 ? `${h}:` : "";
  const mStr = h > 0 && m < 10 ? `0${m}:` : `${m}:`;
  const sStr = s < 10 ? `0${s}` : `${s}`;

  return `${hStr}${mStr}${sStr}`;
}
