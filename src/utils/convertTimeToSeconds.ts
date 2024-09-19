// 시간 문자열을 초로 변환하는 함수
export function convertTimeToSeconds(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}
