import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_TOKEN;
export const slackClient = new WebClient(slackToken);
