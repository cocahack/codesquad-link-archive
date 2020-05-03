import { WebClient } from '@slack/web-api';

const createSlackClient = () => {
  let slackToken: string | undefined = process.env.SLACK_TOKEN;

  if (!slackToken) {
    throw new Error('Slack token must be set.');
  }

  return new WebClient(slackToken);
};

const slackClient = createSlackClient();

export default slackClient;
