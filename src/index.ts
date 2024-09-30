// @ts-nocheck
import { promises as fs } from "fs";
import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Api } from "telegram/tl";
import input from "input"; // npm i input
import {
  CONFIG,
  TELEGRAM_API_ID,
  TELEGRAM_SESSION,
  TELEGRAM_API_HASH,
  TELEGRAM_APP_VERSION,
  TELEGRAM_DEVICE_MODEL,
  TELEGRAM_SYSTEM_VERSION,
} from "./config";
import {
  addPrefixToMessage,
  entitiesToMarkdown,
  markdownEntities,
} from "./utils";
import { toMarkdownV2 } from "@telegraf/entity";

const logger = console;

async function handler(event: NewMessageEvent) {
  const msg = event.message;
  const chatId: number = Number(msg?.chat?.id);
  const topicId = msg.replyTo?.forumTopic ? msg.replyTo?.replyToMsgId : 1;
  const chatCfg =
    CONFIG.include_chats[chatId] || CONFIG.include_chats[msg.chat?.username];

  // filter
  const isInChannel =
    event.isChannel &&
    msg.peerId?.className === "PeerChannel" &&
    msg.chat?.className === "Channel" &&
    msg.chat?.broadcast;
  if (
    !(
      (CONFIG.include_chat_types.includes("channels") && isInChannel) ||
      (chatCfg !== undefined &&
        (chatCfg?.topics?.length ? chatCfg.topics.includes(topicId) : true))
    )
  )
    return;

  const md = entitiesToMarkdown(msg);
  // filter ban words
  const lowecased = md.toLowerCase();
  for (const word of CONFIG.ban_words) {
    if (lowecased.includes(word.toLowerCase())) return;
  }
  if (md.length < CONFIG.min_message_length) return;

  // forward
  try {
    if (msg.chat.noforwards) {
      logger.info(`Copied message`, msg);
      addPrefixToMessage(msg, "↪️ From " + msg.chat.title + ":\n\n");
      await event.client.sendMessage(CONFIG.chat_to_forward_id, {
        message: msg,
      });
    } else {
      await msg.forwardTo(CONFIG.chat_to_forward_id);
      logger.info(`Forwarded message`, msg);
    }
  } catch (e) {
    logger.error(e);
  }
}

async function main() {
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
