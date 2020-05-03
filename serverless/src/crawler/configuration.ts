import { WebClient } from '@slack/web-api';
import ChannelDao from './channel/ChannelDao';
import UserDao from './user/UserDao';
import MessageDao from './conversation/MessageDao';
import ChannelService from './channel/ChannelService';
import UserService from './user/UserService';
import MessageService from './conversation/MessageService';
import { MongoClient } from 'mongodb';

const init = async () => {
  const slackToken = process.env.SLACK_TOKEN;
  const awsRegion = process.env.REGION;

  if (!(slackToken && awsRegion)) {
    throw new Error('Insufficient Environment variables');
  }
  const mongo = await connectMongoDB();

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
    mongo,
    userDictionary,
    channelDictionary,
  };
};

const connectMongoDB = (): Promise<MongoClient> => {
  const user = encodeURIComponent('root');
  const password = encodeURIComponent('example');
  const authMechanism = 'DEFAULT';

  return MongoClient.connect(`mongodb://${user}:${password}@localhost:27017/?authMechanism=${authMechanism}`);
};

export default init;
