import * as Router from '@koa/router';
import mapper from '../../../lib/mapper';
import { User } from '../../../model/User';
import slackClient from '../../../lib/slack';
import { decodeToken, generateToken } from '../../../lib/token';
import {
  ACCESS_TOKEN_NAME,
  DEVELOPMENT_ENV,
  DOMAIN_NAME,
  INVITATION_QUERY_NAME,
  INVITE_MESSAGE,
  SLACK_BOT_NAME,
} from '../../../lib/constants';
import { makeError } from '../../../lib/utils';
import { JwtPayload } from '../../../lib/jwt/types';

type SlackChannel = {
  id: string;
};

const auth = new Router();
const { BASE_URL, CLIENT_BASE_URL, INVITATION_SECRET, AUTH_SECRET } = process.env;

if (!(BASE_URL && INVITATION_SECRET && AUTH_SECRET )) {
  const error = new Error();
  error.name = 'EnvVariablesNotExist';
  error.message = 'Secret key for JWT is missing.';
  throw error;
}

/**
 * Send an invitation via Slack.
 *
 * POST /v1/auth/register
 * {
 *   email: "test@cocahcack.me'
 * }
 */
auth.post('/register', async (ctx) => {
  try {
    const { email } = ctx.request.body;
    const user: User | undefined = await getUserFromEmail(email);

    // An email given not exist in Slack.
    if (!user) {
      const err = makeError('An email given not exist in Slack.', 'EmailNotExistError');
      ctx.throw(400, err);
      return;
    }

    const invitation = await generateToken({ ...user }, INVITATION_SECRET, {
      expiresIn: '1m',
      subject: 'invitation_token',
    });

    const dmChannel: unknown = (
      await slackClient.conversations.open({
        users: user.userId,
      })
    ).channel;

    console.log(dmChannel);

    if (isSlackChannelType(dmChannel)) {
      await slackClient.chat.postMessage({
        unfurl_links: false,
        username: SLACK_BOT_NAME,
        text: INVITE_MESSAGE(
          `${CLIENT_BASE_URL}/enter?${INVITATION_QUERY_NAME}=${invitation}`,
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
    const { invitation } = ctx.request.body;
    const userPayload = await decodeToken<User & JwtPayload>(invitation, INVITATION_SECRET);

    const user: User = extractUserFromPayload(userPayload);

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

const getUserFromEmail = async (email?: string): Promise<User | undefined> => {
  if (!email) {
    return;
  }

  try {
    let user: User | undefined;

    for await (const persisted of mapper.query(
      User,
      {
        subject: 'email',
        type: 'Equals',
        object: email,
      },
      { indexName: 'EmailIndex' },
    )) {
      user = persisted;
    }

    return user;
  } catch (e) {
    throw e;
  }
};

const extractUserFromPayload =  <T extends User & JwtPayload>(payload: T): User => {
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
