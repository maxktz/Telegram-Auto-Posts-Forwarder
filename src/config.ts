require("dotenv").config();

export const CHAT_TO_FORWARD_ID = process.env.CHAT_TO_FORWARD_ID;

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
