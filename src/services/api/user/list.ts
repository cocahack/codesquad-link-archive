import { APIGatewayProxyHandler } from 'aws-lambda';
import mapper from 'lib/mapper';
import { User } from 'lib/model/User';

export const list: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const users = [];

    for await (const user of mapper.scan(User)) {
      users.push(user);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(users, null, 2),
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
          message: "Couldn't fetch the user.",
          stackTrace: process.env.STAGE === 'dev' ? e.stack : null,
          event,
        },
        null,
        2,
      ),
    };
  }
};
