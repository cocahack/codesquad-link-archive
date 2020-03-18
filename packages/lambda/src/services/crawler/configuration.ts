import { WebClient } from '@slack/web-api';
import ChannelDao from 'services/crawler/channel/ChannelDao';
import UserDao from 'services/crawler/user/UserDao';
import MessageDao from 'services/crawler/conversation/MessageDao';
import ChannelService from 'services/crawler/channel/ChannelService';
import UserService from 'services/crawler/user/UserService';
import MessageService from 'services/crawler/conversation/MessageService';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';

const init = () => {
  const slackToken = process.env.SLACK_TOKEN;
  const awsRegion = process.env.REGION;

  if (!(slackToken && awsRegion)) {
    throw new Error('Insufficient Environment variables');
  }
  const mapper = initDataMapper(awsRegion);

  const webClient = new WebClient(slackToken);

  const channelDao = new ChannelDao(webClient);
  const userDao = new UserDao(webClient);
  const messageDao = new MessageDao(webClient);

  const channelService = new ChannelService(channelDao);
  const userService = new UserService(userDao);
  const messageService = new MessageService(messageDao);

  const userDictionary = new Map();
  const channelDictionary = new Map();

  return {
    webClient,
    channelService,
    userService,
    messageService,
    mapper,
    userDictionary,
    channelDictionary,
  };
};

const initDataMapper = region => {
  const stage = process.env.STAGE || 'dev';

  return new DataMapper({
    client:
      stage === 'prod'
        ? new DynamoDB({ region })
        : new DynamoDB({
            region: 'us-east-1',
            endpoint: 'http://localhost:8000',
          }),
    tableNamePrefix: `${stage}-`,
  });
};

const Context = init();

export default Context;
