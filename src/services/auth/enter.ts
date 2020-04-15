import { APIGatewayProxyHandler } from 'aws-lambda';
import { InvitationStrategy } from './strategy/InvitationStrategy';
import { AuthStrategy } from './strategy/AuthStrategy';
import { UserService } from '../api/user/UserService';
import { JwtPayload } from 'lib/jwt/types';
import mapper from 'lib/mapper';

export const enter: APIGatewayProxyHandler = async (event, _context) => {
  const userService = new UserService(mapper);
  const invitationStrategy = new InvitationStrategy(process.env.LINK_SECRET);
  const authStrategy = new AuthStrategy(userService, process.env.AUTH_SECRET);
  const clientBaseUrl = process.env.CLIENT_BASE_URL;

  try {

    const invitationPayload: JwtPayload = await invitationStrategy.verify(
      event.queryStringParameters.invitation,
    );

    if (!invitationPayload.sub) {
      throw new Error('JWT subject not defined');
    }

    const token = await authStrategy.sign(invitationPayload.sub);

    return {
      statusCode: 302,
      headers: {
        Location: `${clientBaseUrl}`,
        'Set-Cookie': `token=${token}; Max-Age=${600 * 10}; HttpOnly`,
      },
      body: null,
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: e.statusCode ? e.statusCode : 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          message: e.message,
        },
        null,
        2,
      ),
    };
  }
};
