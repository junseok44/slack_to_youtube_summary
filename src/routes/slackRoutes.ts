import express from "express";
import { WebClient } from "@slack/web-api";
import { extractYoutubeUrl, formatSummary } from "../utils/formatUtils";
import { processYoutubeSummary } from "../services/processYoutubeSummary";
import Summary from "../models/summary";

const router = express.Router();
const slackToken = process.env.SLACK_BOT_TOKEN || "";
const slackClient = new WebClient(slackToken);

const processedEvents = new Set(); // 중복 이벤트 처리 방지용 Set

// 기존 요약 데이터를 슬랙에 직접 전송하는 엔드포인트
router.post("/events", async (req, res) => {
  const { type, event, event_id } = req.body;

  // Slack URL 검증 처리
  if (type === "url_verification") {
    return res.json({ challenge: req.body.challenge });
  }

  // 중복 이벤트 처리 방지
  if (processedEvents.has(event_id)) {
    return res.status(200).send("Event already processed.");
  }
  processedEvents.add(event_id);

  const { text, channel, ts } = event;
  const youtubeUrl = extractYoutubeUrl(text);

  if (!youtubeUrl) {
    return res.status(400).send("유효한 유튜브 링크를 찾을 수 없습니다.");
  }

  try {
    // 요약 데이터 처리
    const { summaryData } = await processYoutubeSummary(youtubeUrl);

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

    // 에러 발생 시 슬랙에 에러 메시지 전송
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
});

// 요약 데이터를 링크로 전송하는 엔드포인트
router.post("/summary-link", async (req, res) => {
  const { type, event, event_id } = req.body;

  // Slack URL 검증 처리
  if (type === "url_verification") {
    return res.json({ challenge: req.body.challenge });
  }

  // 중복 이벤트 처리 방지
  if (processedEvents.has(event_id)) {
    return res.status(200).send("Event already processed.");
  }
  processedEvents.add(event_id);

  const { text, channel, ts } = event;
  const youtubeUrl = extractYoutubeUrl(text);

  if (!youtubeUrl) {
    return res.status(400).send("유효한 유튜브 링크를 찾을 수 없습니다.");
  }

  try {
    // 요약 데이터 처리
    const { videoInfo, summaryData } = await processYoutubeSummary(youtubeUrl);

    // MongoDB에 요약 데이터 저장
    const newSummary = new Summary({
      mainTopics: summaryData.mainTopics,
      timeline: summaryData.timeline,
      videoId: videoInfo.videoId,
    });

    const savedSummary = await newSummary.save();

    // summaryLink는 HOST와 결합하여 생성
    const summaryLink = `${process.env.HOST}/summary/${savedSummary._id}`;

    // Slack에 링크 전송
    await slackClient.chat.postMessage({
      channel: channel,
      thread_ts: ts,
      text: `지금 막 요약이 도착했어요!\n ${summaryLink}`,
    });

    res.status(200).send("요약 링크가 성공적으로 전송되었습니다.");
  } catch (error: any) {
    console.error(error);

    // 에러 발생 시 Slack에 에러 메시지 전송
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
});

export default router;
