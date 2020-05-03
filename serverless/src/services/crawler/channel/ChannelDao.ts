import { WebClient } from '@slack/web-api';
import { Slack } from 'services/crawler/types';
import ChannelFilter from '../serverless/src/services/crawler/channel/ChannelFilter';
import ChannelListsResponse = Slack.Channel.ChannelListsResponse;

export default class ChannelDao {
  constructor(private readonly webClient: WebClient) {}

  async findAll(): Promise<Slack.Channel.SlackChannel[]> {
    const res: ChannelListsResponse = await this.webClient.channels.list();
    return ChannelFilter.filter(res.channels);
  }
}
