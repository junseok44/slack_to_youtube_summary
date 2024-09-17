import he from "he";
import axios from "axios";
import { find } from "lodash";
import striptags from "striptags";

// fetchData 함수의 반환 타입 정의
const fetchData: (url: string) => Promise<string> =
  typeof fetch === "function"
    ? async function fetchData(url: string): Promise<string> {
        const response = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.youtube.com/",
            Connection: "keep-alive",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            DNT: "1", // Do Not Track: 사용자 추적 비활성화 요청
          },
        });
        return await response.text();
      }
    : async function fetchData(url: string): Promise<string> {
        const { data } = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.youtube.com/",
            Connection: "keep-alive",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            DNT: "1", // Do Not Track: 사용자 추적 비활성화 요청
          },
        });
        return data;
      };

// 자막 데이터의 인터페이스 정의
interface SubtitleLine {
  start: string;
  dur: string;
  text: string;
}

// 자막 트랙의 인터페이스 정의
interface CaptionTrack {
  vssId: string;
  baseUrl: string;
}

// 함수의 매개변수와 반환 타입 정의
export async function getSubtitles({
  videoID,
  lang = "en",
}: {
  videoID: string;
  lang?: string;
}): Promise<SubtitleLine[]> {
  const data = await fetchData(`https://youtube.com/watch?v=${videoID}`);

  // * ensure we have access to captions data
  if (!data.includes("captionTracks"))
    throw new Error(`Could not find captions for video: ${videoID}`);

  const regex = /"captionTracks":(\[.*?\])/;
  const match = regex.exec(data);

  if (!match) {
    throw new Error(`Could not parse caption tracks for video: ${videoID}`);
  }

  const { captionTracks }: { captionTracks: CaptionTrack[] } = JSON.parse(
    `{${match[0]}}`
  );

  const subtitle: CaptionTrack | undefined =
    (find(captionTracks, {
      vssId: `.${lang}`,
    }) as CaptionTrack) ||
    (find(captionTracks, {
      vssId: `a.${lang}`,
    }) as CaptionTrack) ||
    (find(
      captionTracks,
      ({ vssId }) => vssId && vssId.includes(`.${lang}`)
    ) as CaptionTrack);

  // * ensure we have found the correct subtitle lang
  if (!subtitle || !subtitle.baseUrl)
    throw new Error(`Could not find ${lang} captions for ${videoID}`);

  const transcript = await fetchData(subtitle.baseUrl);
  const lines: SubtitleLine[] = transcript
    .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
    .replace("</transcript>", "")
    .split("</text>")
    .filter((line) => line && line.trim())
    .map((line) => {
      const startRegex = /start="([\d.]+)"/;
      const durRegex = /dur="([\d.]+)"/;

      const startMatch = startRegex.exec(line);
      const durMatch = durRegex.exec(line);

      const start = startMatch ? startMatch[1] : "0";
      const dur = durMatch ? durMatch[1] : "0";

      const htmlText = line
        .replace(/<text.+>/, "")
        .replace(/&amp;/gi, "&")
        .replace(/<\/?[^>]+(>|$)/g, "");

      const decodedText = he.decode(htmlText);
      const text = striptags(decodedText);

      return {
        start,
        dur,
        text,
      };
    });

  return lines;
}
