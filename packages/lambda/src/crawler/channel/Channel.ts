import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { Slack } from "../types";

@table('channels')
export class Channel {

  @hashKey()
  channelId: string;

  @attribute()
  channelName: string;

  constructor(slackChannel?: Slack.Channel.SlackChannel) {
    this.channelId = slackChannel?.id;
    this.channelName = slackChannel?.name;
  }

}
