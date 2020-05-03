import { WebClient } from '@slack/web-api';
import { Slack } from '../types';
import UserFilter from './UserFilter';
import UserListsResponse = Slack.User.UserListsResponse;

export default class UserDao {
  constructor(private readonly webClient: WebClient) {}

  async findAll(): Promise<Slack.User.SlackUser[]> {
    const res: UserListsResponse = await this.webClient.users.list();
    return UserFilter.filter(res.members);
  }
}
