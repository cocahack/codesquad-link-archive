import { APIGatewayProxyHandler } from 'aws-lambda';
import mapper from 'lib/mapper';
import { Channel } from 'lib/model/Channel';

export const list: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const channels = [];

    for await (const channel of mapper.scan(Channel)) {
      channels.push(channel);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(channels, null, 2),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: e.statusCode || 501,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          message: "Couldn't fetch the channels.",
          stackTrace: process.env.STAGE === 'dev' ? e.stack : null,
          event,
        },
        null,
        2,
      ),
    };
  }
};
