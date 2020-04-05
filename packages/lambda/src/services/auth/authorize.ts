import { CustomAuthorizerHandler } from 'aws-lambda';
import { AuthStrategy } from './strategy/AuthStrategy';
import { UserService } from '../api/user/UserService';
import { getCookie } from 'lib/http';
import { buildIAMPolicy } from 'lib/utils';
import mapper from 'lib/mapper';

export const authorize: CustomAuthorizerHandler = async (event, _context) => {
  console.log('methodArn: ', event.methodArn);
  if (event.type !== 'REQUEST') {
    throw new Error('This authorizer only accepts REQUEST type.');
  }

  const token = getCookie(event.headers['Cookie'] || event.headers['cookie'], 'token');
  const userService = new UserService(mapper);
  const authStrategy = new AuthStrategy(userService, process.env.AUTH_SECRET);

  try {
    const payload = await authStrategy.verify(token);
    console.log('Token verified.');

    return buildIAMPolicy(payload.id, 'Allow', event.methodArn, payload);
  } catch (e) {
    console.error(e);

    throw e;
  }
};
