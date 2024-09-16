import { WebClient } from "@slack/web-api";
import express from "express";
import processSummary from "../services/processSummary";
import { getCaptions, getVideoInfo } from "../services/youtubeService";
import { extractYoutubeUrl, formatSummary } from "../utils/formatUtils";

const router = express.Router();

const slackToken = process.env.SLACK_BOT_TOKEN || "";

const processedEvents = new Set(); // 간단한 예로 메모리에 저장

if (!slackToken) {
  console.error("SLACK_BOT_TOKEN 환경 변수가 설정되지 않았습니다.");
}

const slackClient = new WebClient(slackToken);

router.post("/events", async (req, res) => {
  const { type, event, event_id } = req.body;

  if (type === "url_verification") {
    // 슬랙 URL 검증 요청 처리
    return res.json({ challenge: req.body.challenge });
  }

  if (processedEvents.has(event_id)) {
    // 이미 처리된 이벤트에 대해 200 응답을 보내고 종료
    return res.status(200).send("Event already processed.");
  }

  if (event && event.type === "app_mention") {
    processedEvents.add(event_id);

    const { text, channel, ts } = event;
    const youtubeUrl = extractYoutubeUrl(text);

    if (!youtubeUrl) {
      return res.status(400).send("유효한 유튜브 링크를 찾을 수 없습니다.");
    }

    try {
      // 요약 처리 시작
      const videoInfo = await getVideoInfo(youtubeUrl);
      const captions = await getCaptions(videoInfo.videoId);
      const summaryData = await processSummary(captions, videoInfo);

      if (!summaryData) throw new Error("요약 데이터가 없습니다.");

      // 사람이 읽기 쉬운 형태로 변환
      const readableSummary = formatSummary(summaryData);

      // 슬랙에 메시지로 댓글 작성
      await slackClient.chat.postMessage({
        channel: channel,
        thread_ts: ts,
        text: readableSummary,
      });

      res.status(200).send("요약이 성공적으로 스레드에 게시되었습니다.");
    } catch (error: any) {
      console.error(error);

      // 슬랙 메시지 전송 실패에 대비한 추가 에러 핸들링
      try {
        await slackClient.chat.postMessage({
          channel: channel,
          thread_ts: ts,
          text: `요약 생성 중 오류가 발생했습니다: ${error.message}`,
        });
      } catch (postError: any) {
        console.error("슬랙 메시지 전송 실패:", postError);
      }

      res.status(500).send("요약 생성 중 오류가 발생했습니다.");
    }
  } else {
    res.status(200).send("처리되지 않은 이벤트 타입");
  }
});

export default router;
