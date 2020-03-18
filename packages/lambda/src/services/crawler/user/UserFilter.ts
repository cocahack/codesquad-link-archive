import { Slack } from 'services/crawler/types';
import SlackUser = Slack.User.SlackUser;

export default class UserFilter {
  static readonly filter = (slackUsers?: SlackUser[]): SlackUser[] => {
    return slackUsers?.filter(
      slackUser => !slackUser.is_app_user && !slackUser.is_bot,
    );
  };
}
