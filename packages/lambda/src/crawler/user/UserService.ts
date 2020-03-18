import UserDao from './UserDao';
import { User } from 'lib/model/User';

export default class UserService {
  constructor(private readonly userDao: UserDao) {}

  async getLists() {
    const slackUsers = await this.userDao.findAll();
    return slackUsers.map(slackUser => {
      const user = new User();
      user.userId = slackUser?.id;
      user.userName = slackUser?.profile?.display_name || slackUser?.name;
      user.userImage = slackUser?.profile?.image_original;
      user.email = slackUser?.profile?.email;
      return user;
    });
  }
}
