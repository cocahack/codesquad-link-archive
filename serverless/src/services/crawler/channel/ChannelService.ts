import ChannelDao from '../serverless/src/services/crawler/channel/ChannelDao';
import { Channel } from '../serverless/src/model/Channel';

export default class ChannelService {
  constructor(private readonly channelDao: ChannelDao) {}

  async getLists() {
    const slackChannels = await this.channelDao.findAll();
    return slackChannels.map(slackChannel => {
      const channel = new Channel();
      channel.channelId = slackChannel.id;
      channel.channelName = slackChannel.name;
      return channel;
    });
  }
}
