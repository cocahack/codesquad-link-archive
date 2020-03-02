import { WebClient } from "@slack/web-api";
import { config } from 'dotenv';
import ChannelDao from "../ChannelDao";
import { Slack } from "../../types";
import SlackChannel = Slack.Channel.SlackChannel;

/**
 * MUST connect with Internet for testing.
 */
describe('ChannelDao', () => {

  let webClient: WebClient | null;
  let slackToken: string | null;
  let channelDao: ChannelDao | null;

  beforeAll(() => {
    config();
    slackToken = process.env.SLACK_TOKEN;
    webClient = new WebClient(slackToken);
    channelDao = new ChannelDao(webClient);
  });

  it('should define slack token', () => {
    expect(slackToken).toBeDefined();
  });

  it('should return all channels in slack workspace except private or archived channels', async () => {
    const slackChannels: Promise<SlackChannel[]> = channelDao.findAll();
    await expect(slackChannels).resolves.not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ is_archive: true }),
        expect.objectContaining({ is_private: true }),
      ])
    );
  });

});