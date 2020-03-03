import { Slack } from "../types";
import SlackMessage = Slack.Conversation.SlackMessage;

export default class MessageFilter {

  static readonly filter = (slackMessage?: SlackMessage[]): SlackMessage[] => {
    return slackMessage?.filter(slackMessage => {
      return !(slackMessage.subtype === 'bot_message' || slackMessage.bot_id) &&
        slackMessage.client_msg_id &&
        MessageFilter.hasLink(slackMessage)
    });
  };

  static readonly hasLink = (slackMessage: SlackMessage): boolean => {
    return slackMessage.blocks?.some(block => block.elements?.some(element => element.elements?.some(innerElement => innerElement.type === 'link')));
  };

}