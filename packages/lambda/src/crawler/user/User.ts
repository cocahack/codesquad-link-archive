import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { Slack } from "../types";
import SlackUser = Slack.User.SlackUser;

@table('users')
export class User {

  @hashKey()
  userId: string;

  @attribute()
  userName: string;

  @attribute()
  userImage?: string;

  @attribute({ defaultProvider: () => new Date() })
  createdAt: Date;

  @attribute({ defaultProvider: () => new Date() })
  updatedAt: Date;

  constructor(slackUser?: SlackUser) {
    this.userId = slackUser?.id;
    this.userName = slackUser?.name;
    this.userImage = slackUser?.profile?.image_original;
  }

}
