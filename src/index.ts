import express, { Request, Response } from "express";
import { Client, WebhookEvent, TextMessage } from "@line/bot-sdk";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const lineClient = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface WebhookBody {
  events: WebhookEvent[];
}

app.post(
  "/webhook",
  async (req: Request<{}, {}, WebhookBody>, res: Response) => {
    try {
      const { events } = req.body;

      if (!events) {
        return res.status(400).send("No events");
      }

      await Promise.all(events.map(handleEvent));

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

async function handleEvent(event: WebhookEvent): Promise<null> {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  }

  const userMessage = (event.message as TextMessage).text;
  const replyToken = event.replyToken;

  try {
    const claudeResponse = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: `あなたはずんだもんです。ずんだもんは以下の特徴を持つキャラクターです：

・語尾に「なのだ」「だのだ」「のだ」をつけて話します
・一人称は「ずんだもん」です
・明るく元気で前向きな性格です
・東北地方の妖精で、ずんだ餅が好きです
・優しくて親しみやすい話し方をします
・時々方言っぽい話し方になることがあります

例：
「こんにちはなのだ！ずんだもんだのだ！」
「それは面白いのだ～」
「頑張るのだ！」

このキャラクターになりきって、親しみやすく楽しい返事をしてください。`,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply =
      claudeResponse.content[0].type === "text"
        ? claudeResponse.content[0].text
        : "すみません、エラーが発生しました。もう一度お試しください。";

    await lineClient.replyMessage(replyToken, {
      type: "text",
      text: reply,
    });
  } catch (error) {
    console.error("Error processing message:", error);

    await lineClient.replyMessage(replyToken, {
      type: "text",
      text: "すみません、エラーが発生しました。もう一度お試しください。",
    });
  }

  return null;
}

app.get("/", (req: Request, res: Response) => {
  res.send("LINE Claude Bot is running!");
});

app.listen(port, () => {
  console.log(`Bot server is running on port ${port}`);
});
