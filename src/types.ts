export type ChatId = number;
export type ChatUsername = string;
export type ChatTopicId = number;
export type ChatLike = "channels";

export interface ChatToParse {
  id?: ChatId;
  username?: ChatUsername;
  topics?: ChatTopicId[];
  from_author_only?: boolean;
}

export interface Config {
  chat_to_forward_id: ChatId | ChatUsername;
  min_message_length?: number;
  ban_words?: string[];
  include_chats?: (ChatLike | ChatId | ChatUsername)[];
}

export interface ParsedConfig {
  chat_to_forward_id: ChatId | ChatUsername;
  min_message_length: number;
  ban_words: string[];
  include_chats: { [key: ChatId | ChatUsername]: ChatToParse };
  include_chat_types: ChatLike[];
}
