import { LinkMetadata } from "./LinkMetadata";
import { Message } from "./Message";

export class Link {
  url: string;
  linkTimestamp: string;
  date: string;
  userId: string;
  channelId: string;
  metadata?: LinkMetadata;
  message?: Message;
}
