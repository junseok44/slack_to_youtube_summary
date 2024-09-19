// src/services/claudeService.ts
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { groupCaptions } from "../utils/groupCaptions";
import { CaptionItem } from "../@types/summary";
import { systemMessage } from "../constants/prompts";

dotenv.config();

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

export async function summarizeText(captionsJson: string): Promise<string> {
  const captionsArray: CaptionItem[] = JSON.parse(captionsJson);

  const captionsText = groupCaptions(captionsArray);

  const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY,
  });

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 8190,
    temperature: 0,
    system: systemMessage,
    messages: [
      {
        role: "user",
        content: captionsText,
      },
    ],
  });

  const assistantReply = msg.content
    .map((item) => (item.type === "text" ? item.text : ""))
    .join("");

  return assistantReply;
}
