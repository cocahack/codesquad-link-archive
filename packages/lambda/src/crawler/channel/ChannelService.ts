import ChannelDao from "./ChannelDao";
import { Channel } from "./Channel";

export default class ChannelService {

  constructor(private readonly channelDao: ChannelDao) {}

  async getLists() {
    const slackChannels = await this.channelDao.findAll();
    return slackChannels.map(slackChannel => new Channel(slackChannel));
  }

}