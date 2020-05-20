import { WebClient } from '@slack/web-api';
import { INVITE_MESSAGE, SLACK_BOT_NAME } from './constants';

const { SLACK_TOKEN, CLIENT_BASE_URL } = process.env;
const slackClient = new WebClient(SLACK_TOKEN);

// The Slack Channel Object has an id.
// Other properties don't care.
export type SlackChannel = {
  id: string;
};

// Custom type guard function for narrowing the unknown Type
const isSlackChannelType = (value: unknown): value is SlackChannel => {
  return value['id'];
};

export const openDMChannel = async (userId: string): Promise<SlackChannel | undefined> => {
  const { channel } = await slackClient.conversations.open({ user: userId });
  return isSlackChannelType(channel) ? channel : undefined;
}

export const sendCodeToUser = async (channel: SlackChannel, code: string) => {
  await slackClient.chat.postMessage({
    unfurl_links: false,
    username: SLACK_BOT_NAME,
    text: INVITE_MESSAGE(
      `${CLIENT_BASE_URL}/entrance?code=${code}`,
    ),
    channel: channel.id,
  });
};

export default slackClient;
