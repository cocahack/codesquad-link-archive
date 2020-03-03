import MessageDao from "./MessageDao";
import { Link } from "./Link";
import makeLinks from "./helper";

export default class MessageService {

  constructor(private readonly messageDao: MessageDao) {}

  async getLists(channelId: string): Promise<Link[]> {
    const slackMessages = await this.messageDao.findAll(channelId);
    return slackMessages.map(slackMessage => makeLinks(slackMessage, channelId)).flat();
  }

}