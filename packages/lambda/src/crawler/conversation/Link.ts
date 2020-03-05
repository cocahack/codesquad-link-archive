import { attribute, hashKey, rangeKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { LinkMetadata } from "./LinkMetadata";
import { embed } from "@aws/dynamodb-data-mapper";
import { Message } from "./Message";

@table('links')
export class Link {

  @hashKey()
  url: string;

  @rangeKey()
  linkTimestamp: string;

  @attribute({
    indexKeyConfigurations: {
      IndexIdIndex: 'RANGE',
    },
  })
  userId: string;

  @attribute({
    indexKeyConfigurations: {
      IndexIdIndex: 'RANGE',
    },
  })
  channelId: string;

  @attribute({ memberType: embed(LinkMetadata) })
  metadata?: LinkMetadata;

  @attribute({ memberType: embed(Message) })
  message?: Message;

}
