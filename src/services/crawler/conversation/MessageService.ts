import MessageDao from 'services/crawler/conversation/MessageDao';
import makeLinks from 'services/crawler/conversation/makeLinks';
import { Link } from 'lib/model/Link';

export default class MessageService {
  constructor(private readonly messageDao: MessageDao) {}

  async getLists(channelId: string): Promise<Link[]> {
    const slackMessages = await this.messageDao.findAll(channelId);
    return slackMessages
      .map(slackMessage => makeLinks(slackMessage, channelId))
      .flat();
  }
}
