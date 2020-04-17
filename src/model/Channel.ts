import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";

@table('channels')
export class Channel {

  @hashKey()
  channelId: string;

  @attribute()
  channelName: string;

}
