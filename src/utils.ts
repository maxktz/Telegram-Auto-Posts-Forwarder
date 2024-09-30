import { Api } from "telegram/tl";

export function entitiesToMarkdown(message: Api.Message) {
  let md = message.message;
  let offset = 0;

  if (!message.entities) return md;

  for (const entity of message.entities) {
    const start = entity.offset + offset;
    const end = entity.length + start;
    // if (entity.className === "MessageEntityBold") {
    //   message =
    //     message.slice(0, start) +
    //     "**" +
    //     message.slice(start, end) +
    //     "**" +
    //     message.slice(end);
    //   offset += 4;
    // } else if (entity.className === "MessageEntityItalic") {
    //   message =
    //     message.slice(0, start) +
    //     "__" +
    //     message.slice(start, end) +
    //     "__" +
    //     message.slice(end);
    //   offset += 4;
    // } else if (entity.className === "MessageEntityCode") {
    //   message =
    //     message.slice(0, start) +
    //     "`" +
    //     message.slice(start, end) +
    //     "`" +
    //     message.slice(end);
    //   offset += 2;
    // } else if (entity.className === "MessageEntityPre") {
    //   message =
    //     message.slice(0, start) +
    //     "```" +
    //     message.slice(start, end) +
    //     "```" +
    //     message.slice(end);
    //   offset += 6;
    if (entity.className === "MessageEntityTextUrl") {
      md =
        md.slice(0, start) +
        "[" +
        md.slice(start, end) +
        "](" +
        entity.url +
        ")" +
        md.slice(end);
      offset += 4 + entity.url.length;
    }
  }
  return md;
}

export function addPrefixToMessage(msg: Api.Message, prefix: string) {
  msg.message = prefix + msg.message;
  for (const entity of msg.entities || []) {
    entity.offset += prefix.length;
  }
}
