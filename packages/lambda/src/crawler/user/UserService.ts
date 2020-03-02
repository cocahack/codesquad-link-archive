import UserDao from "./UserDao";
import { User } from "./User";

export default class UserService {

  constructor(private readonly userDao: UserDao) {}

  async getLists() {
    const slackUsers = await this.userDao.findAll();
    return slackUsers.map(slackUser => new User(slackUser));
  }

}