import * as Router from '@koa/router';
import * as crypto from 'crypto';
import { ACCESS_TOKEN_NAME, DEVELOPMENT_ENV, DOMAIN_NAME, INVITE_MESSAGE, SLACK_BOT_NAME } from '../../../lib/constants';
import { makeError } from '../../../lib/error';
import redis from '../../../lib/redis';
import slackClient from '../../../lib/slack';
import { generateToken } from '../../../lib/token';
import registerMiddleware from '../../../middlewares/auth/register';
import { User } from '../../../schema/user';

type SlackChannel = {
  id: string;
};

type AuthRouterState = {
  user: User,
  userId?: string,
  userPayload?: User,
}

const auth = new Router<AuthRouterState>();

const { CLIENT_BASE_URL, AUTH_SECRET } = process.env;
// console.dir(process.env, { depth: 4 });

// if (!(CLIENT_BASE_URL && INVITATION_SECRET && AUTH_SECRET )) {
//   const error = new Error();
//   error.name = 'EnvVariablesNotExist';
//   error.message = 'The Secret key for JWT is missing.';
//   throw error;
// }

/**
 * Send an invitation via Slack.
 *
 * POST /v1/auth/register
 * {
 *   email: "test@cocahack.me'
 * }
 */
auth.post('/register', registerMiddleware, async (ctx) => {
  try {
    const { user } = ctx.state;

    const key = crypto.randomBytes(20).toString('hex');

    await redis.multi()
      .hmset(key, extractUserFromPayload(user))
      .expire(key, 60 * 10)
      .exec();

    const dmChannel: unknown = (
      await slackClient.conversations.open({
        users: user.userId,
      })
    ).channel;

    if (isSlackChannelType(dmChannel)) {
      await slackClient.chat.postMessage({
        unfurl_links: false,
        username: SLACK_BOT_NAME,
        text: INVITE_MESSAGE(
          `${CLIENT_BASE_URL}/enter?key=${key}`,
        ),
        channel: dmChannel.id,
      });
      ctx.status = 204;
      return;
    } else {
      const err = makeError('Fail to open the DM channel.', 'SlackError');
      console.log(err);
      ctx.throw(500, err);
    }
  } catch (e) {
    console.log(e);
    ctx.throw(500, e);
  }
});

auth.post('/enter', async (ctx) => {
  try {
    const { key } = ctx.request.query;

    const result = await redis.multi()
      .hgetall(key)
      .del(key)
      .exec();

    /*
    * A transaction fails.
    * The first item in each array is an error object.
    */
    if(result[0][0] || result[1][0] || result[1][1] !== 1) {
      ctx.throw(500, new Error('Cannot fetch from REDIS.'));
    } 

    const user = extractUserFromPayload(result[0][1]);

    const accessToken = await generateToken(user, AUTH_SECRET, {
      expiresIn: '1h',
      subject: ACCESS_TOKEN_NAME,
    });

    ctx.cookies.set(ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      domain: DOMAIN_NAME,
    });

    if (process.env.NODE_ENV === DEVELOPMENT_ENV) {
      ctx.cookies.set(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false,
      });
    }

    ctx.status = 200;
    ctx.body = {
      message: 'Welcome!',
    };
  } catch (e) {
    console.error(e);
    ctx.throw(401, e);
  }
});

auth.post('/login', (ctx) => {
  if (!ctx.state.userId) {
    ctx.status = 401;
    ctx.body = {
      message: 'NOT_AUTHORIZED'
    };
    return;
  } else {
    ctx.status = 200;
    ctx.body = {
      user: extractUserFromPayload(ctx.state.userPayload),
    };
  }
});

const extractUserFromPayload =  <T extends User>(payload: T) => {
  console.dir(payload, {depth: 2});
  return {
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    userImage: payload.userImage,
  };
};

// Custom type guard function for narrowing the unknown Type
const isSlackChannelType = (value: unknown): value is SlackChannel => {
  return value['id'];
};

export default auth;