import * as Router from '@koa/router';
import * as crypto from 'crypto';
import { INVITE_MESSAGE, SLACK_BOT_NAME } from '../../lib/constants';
import { makeError } from '../../lib/error';
import { checkCode, saveCode } from '../../lib/redis/code-namespace';
import slackClient from '../../lib/slack';
import { createUserTokens, setTokenToCookie } from '../../lib/token';
import registerMiddleware from '../../middlewares/auth/register';
import UserModel, { User } from '../../schema/user';

type SlackChannel = {
  id: string;
};

type AuthRouterState = {
  user: User,
  userId?: string,
  userPayload?: User,
}

const auth = new Router<AuthRouterState>();

const { CLIENT_BASE_URL } = process.env;

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
    const code = crypto.randomBytes(20).toString('hex');

    await saveCode(code, user.userId);

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
          `${CLIENT_BASE_URL}/entrance?code=${code}`,
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

auth.post('/entrance', async (ctx) => {
  try {
    const { code } = ctx.request.query;

    const userId: User['userId'] = await checkCode(code);
    const user = await UserModel.findOne({ userId });

    const authTokens = await createUserTokens(user);

    setTokenToCookie(ctx, authTokens);

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