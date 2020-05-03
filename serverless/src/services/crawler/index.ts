import { APIGatewayProxyHandler } from 'aws-lambda';
import Context from '../serverless/src/services/crawler/configuration';
import { User } from '../serverless/src/model/User';
import { Channel } from '../serverless/src/model/Channel';
import 'source-map-support/register';

export const crawl: APIGatewayProxyHandler = async (event, _context) => {
  await initDictionary();

  console.log('gathering users');
  const users = await Context.userService.getLists();
  console.log('gathering channels');
  const channels = await Context.channelService.getLists();

  console.log('gathering links');
  const promises = channels.map(channel =>
    Context.messageService.getLists(channel.channelId),
  );
  const links = (await Promise.all(promises)).flat();

  console.log('attempt persisting all entities');
  for await (const _persisted of Context.mapper.batchPut([
    ...users,
    ...channels,
    ...links,
  ])) {
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'function executed successfully!',
        input: event,
      },
      null,
      2,
    ),
  };
};

const initDictionary = async () => {
  for await (const user of Context.mapper.scan(User)) {
    Context.userDictionary.set(user.userId, user);
  }

  for await (const channel of Context.mapper.scan(Channel)) {
    Context.channelDictionary.set(channel.channelId, channel);
  }
};
