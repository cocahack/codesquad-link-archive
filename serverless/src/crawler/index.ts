import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import init from './configuration';

export const crawl: APIGatewayProxyHandler = async (event, _context) => {
  const Context = await init();

  const db = Context.mongo.db('domain');

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

  await db.collection('users').insertMany(users);
  await db.collection('channels').insertMany(channels);
  await db.collection('links').insertMany(links);

  await Context.mongo.close();

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

