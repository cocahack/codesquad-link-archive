import { WebClient } from '@slack/web-api';
import { Slack } from '../types';
import ChannelFilter from './ChannelFilter';
import ChannelListsResponse = Slack.Channel.ChannelListsResponse;

export default class ChannelDao {
  constructor(private readonly webClient: WebClient) {}

  async findAll(): Promise<Slack.Channel.SlackChannel[]> {
    const res: ChannelListsResponse = await this.webClient.channels.list();
    return ChannelFilter.filter(res.channels);
  }
}
