import fs from "fs";
import path from "path";

/**
 * JSON 데이터를 지정된 파일 경로에 저장합니다.
 * @param {string} directoryPath - 저장할 디렉토리 경로
 * @param {string} fileName - 저장할 파일 이름
 * @param {object} data - 저장할 JSON 데이터
 */
export function saveToFile(
  directoryPath: string,
  fileName: string,
  data: object
) {
  // 디렉토리 존재 여부 확인 후 생성
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  const filePath = path.join(directoryPath, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`데이터가 성공적으로 저장되었습니다: ${filePath}`);
}
