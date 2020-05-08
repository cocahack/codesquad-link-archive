import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import init from './configuration';

export const crawl: APIGatewayProxyHandler = async (event, _context) => {
  const Context = await init();

  let db;
  if (process.env.NODE_ENV === 'development') {
    db = Context.mongo.db('domain');
  } else {
    db = Context.mongo.db();
  }

  console.log('gathering users');
  const users = await Context.userService.getLists();
  console.log('gathering channels');
  const channels = await Context.channelService.getLists();

  console.log('gathering links');
  const promises = channels.map((channel) =>
    Context.messageService.getLists(channel.channelId),
  );
  const links = (await Promise.all(promises)).flat();

  console.log('attempt persisting all entities');

  const userUpdateQueries = users.map((user) => {
    return {
      updateOne: {
        filter: { 
          userId: user.userId,
          email: user.email,
        },
        update: {
          $set: {
            userImage: user.userImage,
            userName: user.userName,
          },
        },
        upsert: true,
      },
    };
  });

  const channelUpdateQueries = channels.map((channel) => {
    return {
      updateOne: {
        filter: { channelId: channel.channelId },
        update: {
          $set: {
            channelName: channel.channelName,
          },
        },
        upsert: true,
      },
    };
  });

  await db.collection('users').bulkWrite(userUpdateQueries);
  await db.collection('channels').bulkWrite(channelUpdateQueries);
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
