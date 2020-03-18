import { ConversationsHistoryArguments, WebClient } from '@slack/web-api';
import { Slack } from 'services/crawler/types';
import * as moment from 'moment';
import ConversationHistoryResponse = Slack.Conversation.ConversationHistoryResponse;
import MessageFilter from 'services/crawler/conversation/MessageFilter';

export default class MessageDao {
  constructor(private readonly webClient: WebClient) {}

  async findAll(channelId: string): Promise<Slack.Conversation.SlackMessage[]> {
    const args: ConversationsHistoryArguments = {
      channel: channelId,
      oldest: moment()
        .subtract(1, 'days')
        .startOf('day')
        .unix()
        .toString(),
      latest: moment()
        .subtract(1, 'days')
        .endOf('day')
        .unix()
        .toString(),
    };

    const res: ConversationHistoryResponse = await this.webClient.conversations.history(
      args,
    );

    return MessageFilter.filter(res.messages);
  }
}
