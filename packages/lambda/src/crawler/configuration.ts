import { WebClient } from "@slack/web-api";
import ChannelDao from "./channel/ChannelDao";
import UserDao from "./user/UserDao";
import MessageDao from "./conversation/MessageDao";
import ChannelService from "./channel/ChannelService";
import UserService from "./user/UserService";
import MessageService from "./conversation/MessageService";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import * as DynamoDB from "aws-sdk/clients/dynamodb";

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
  }

};

const initDataMapper = (region) => {
  const stage = process.env.STAGE || 'dev';

  return new DataMapper({
    client: stage === 'prod' ? new DynamoDB({ region } ) : new DynamoDB({ region: 'us-east-1', endpoint: 'http://localhost:8000'}),
    tableNamePrefix: `${stage}-`,
  });
};

const Context = init();

export default Context;
