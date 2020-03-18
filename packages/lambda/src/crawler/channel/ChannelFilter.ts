import { Slack } from '../types';
import SlackChannel = Slack.Channel.SlackChannel;

export default class ChannelFilter {
  static readonly filter = (slackChannels?: SlackChannel[]): SlackChannel[] => {
    return slackChannels?.filter(
      slackChannel => !slackChannel.is_private && !slackChannel.is_archived,
    );
  };
}
