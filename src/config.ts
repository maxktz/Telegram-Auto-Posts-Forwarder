// @ts-nocheck
import { Config, ParsedConfig } from "./types";
const userConfig: Config = require("../config.js");

const cfg: ParsedConfig = {
  ...userConfig,
  ban_words: userConfig.ban_words || [],
  min_message_length: userConfig.min_message_length || 0,
  include_chats: {},
  include_chat_types: [],
};

for (const value of userConfig.include_chats || []) {
  if (["all", "channels", "groups", "supergroups"].includes(value)) {
    cfg.include_chat_types.push(value);
    continue;
  }
  let chatIdStr, topicIdStr;
  [chatIdStr, topicIdStr] = String(value).split("/", 2);

  let chatId = Number(chatIdStr);
  let username;
  if (isNaN(chatId)) {
    username = chatIdStr;
  }

  let chat;
  if (username) {
    cfg.include_chats[username] = { username: username };
    chat = cfg.include_chats[username];
  } else {
    cfg.include_chats[chatId] = { id: chatId };
    chat = cfg.include_chats[chatId];
  }

  if (!chat.topics) chat.topics = [];

  if (topicIdStr !== undefined) {
    let topicId = Number(topicIdStr);
    chat.topics.push(topicId);
  }
}
export const CONFIG = cfg;

export const TELEGRAM_SESSION =
  process.env.TELEGRAM_SESSION || "sessions/account";
export const TELEGRAM_API_ID = Number(process.env.TELEGRAM_API_ID || 2040);
export const TELEGRAM_API_HASH =
  process.env.TELEGRAM_API_HASH || "b18441a1ff607e10a989891a5462e627";
export const TELEGRAM_DEVICE_MODEL =
  process.env.TELEGRAM_DEVICE_MODEL || "MacBook Air M1";
export const TELEGRAM_SYSTEM_VERSION =
  process.env.TELEGRAM_SYSTEM_VERSION || "macOS 14.4.1";
export const TELEGRAM_APP_VERSION =
  process.env.TELEGRAM_APP_VERSION || "4.16.8 arm64";
