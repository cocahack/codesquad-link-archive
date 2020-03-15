import { attribute, hashKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { Slack } from "../types";

@table('users')
export class User {

  @hashKey()
  userId: string;

  @attribute()
  userName: string;

  @attribute()
  userImage?: string;

  @attribute()
  email: string;

  constructor(slackUser?: Slack.User.SlackUser) {
    this.userId = slackUser?.id;
    this.userName = slackUser?.profile?.display_name || slackUser?.name;
    this.userImage = slackUser?.profile?.image_original;
    this.email = slackUser?.profile?.email;
  }

}
