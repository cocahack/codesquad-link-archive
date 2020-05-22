import * as Router from '@koa/router';
import * as crypto from 'crypto';
import { checkCode, saveCode } from '../../lib/redis/code-namespace';
import { openDMChannel, sendCodeToUser, SlackChannel } from '../../lib/slack';
import { createUserTokens, setTokenToCookie } from '../../lib/token';
import registerMiddleware from '../../middlewares/auth/register';
import User, { IUser } from '../../schema/user';


type AuthRouterState = {
  user: IUser,
  userId?: string,
  userPayload?: IUser,
}

const auth = new Router<AuthRouterState>();

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

    const dmChannel: SlackChannel = await openDMChannel(user.userId);
    await sendCodeToUser(dmChannel, code);

    ctx.status = 201;
    ctx.body = {
      message: 'The verification code has been sent by DM. Please check the message in Slack.'
    };
  } catch (e) {
    console.log(e);
    ctx.throw(500, e);
  }
});

auth.post('/entrance', async (ctx) => {
  try {
    const { code } = ctx.request.body;

    const userId: IUser['userId'] = await checkCode(code);
    const user = await User.findOne({ userId });

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

const extractUserFromPayload =  <T extends IUser>(payload: T) => {
  return {
    userId: payload.userId,
    userName: payload.userName,
    email: payload.email,
    userImage: payload.userImage,
  };
};

export default auth;
