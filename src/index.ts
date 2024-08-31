// @ts-nocheck
import { promises as fs } from "fs";
import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Api } from "telegram/tl";
import input from "input"; // npm i input
import {
  CHAT_TO_FORWARD_ID,
  TELEGRAM_API_ID,
  TELEGRAM_SESSION,
  TELEGRAM_API_HASH,
  TELEGRAM_APP_VERSION,
  TELEGRAM_DEVICE_MODEL,
  TELEGRAM_SYSTEM_VERSION,
} from "./config";
import { entitiesToMarkdown, markdownEntities } from "./utils";
import { toMarkdownV2 } from "@telegraf/entity";

const logger = console;
let BAN_WORDS: string = "";

async function handler(event: NewMessageEvent) {
  // filter message from channel
  // if (event.message.peerId.className !== "PeerChannel") return;
  // if (!event.isChannel) return;
  if (
    event.message.chat?.className === "Channel" &&
    event.message.chat.broadcast
  ) {
    const md = entitiesToMarkdown(event.message);
    // filter ban words
    for (const word of BAN_WORDS) {
      if (md.includes(word)) return;
    }

    // forward
    try {
      await event.message.forwardTo(CHAT_TO_FORWARD_ID);
      logger.info(`Forwarded message`);
    } catch (e) {
      logger.error(e);
    }
  }
}

async function main() {
  BAN_WORDS = JSON.parse(
    await fs.readFile("ban_words.json", { encoding: "utf-8" })
  );

  const client = new TelegramClient(
    TELEGRAM_SESSION,
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    {
      appVersion: TELEGRAM_APP_VERSION,
      deviceModel: TELEGRAM_DEVICE_MODEL,
      systemVersion: TELEGRAM_SYSTEM_VERSION,
      langCode: "en",
      systemLangCode: "en",
    }
  );
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again

  const event = new NewMessage({ incoming: true, forwards: false });
  client.addEventHandler(handler, new TelegramClient.events.NewMessage({}));

  console.log("Started!");
}
main();
