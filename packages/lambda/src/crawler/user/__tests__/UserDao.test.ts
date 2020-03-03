import { WebClient } from "@slack/web-api";
import { config } from 'dotenv';
import UserDao from "../UserDao";
import { Slack } from "../../types";
import SlackUser = Slack.User.SlackUser;

/**
 * MUST connect with Internet for testing.
 */
describe('UserDao', () => {

  let webClient: WebClient | null;
  let slackToken: string | null;
  let userDao: UserDao | null;

  beforeAll(() => {
    config();
    slackToken = process.env.SLACK_TOKEN;
    webClient = new WebClient(slackToken);
    userDao = new UserDao(webClient);
  });

  it('should define slack token', () => {
    expect(slackToken).toBeDefined();
  });

  it('should return all users in slack workspace excepts bot or app user', async () => {
    const slackUsers: Promise<SlackUser[]> = userDao.findAll();
    await expect(slackUsers).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining<Partial<SlackUser>>({ is_bot: true }),
        expect.objectContaining<Partial<SlackUser>>({ is_app_user: true }),
      ])
    );
  });

});