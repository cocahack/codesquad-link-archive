import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { Slack } from "../types";
import SlackChannel = Slack.Channel.SlackChannel;

@table('channels')
export class Channel {

  @hashKey()
  channelId: string;

  @attribute()
  channelName: string;

  @attribute({ defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute({ defaultProvider: () => new Date() })
  updatedAt: Date;

  constructor(slackChannel?: SlackChannel) {
    this.channelId = slackChannel?.id;
    this.channelName = slackChannel?.name;
  }

}
