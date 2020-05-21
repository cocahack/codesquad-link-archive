import { Middleware } from 'koa';
import { makeError } from '../../lib/error';
import User from '../../schema/user';

const registerMiddleware: Middleware = async (ctx, next) => {
  try {
    const { email } = ctx.request.body;
    if(!email) {
      ctx.throw(400, makeError('This request requires an email.', 'BadRequestError'));
    }
    const user = await User.findOne({ email });

    if (!user) {
      const err = makeError('An email given not exist in Slack.', 'EmailNotExistError');
      ctx.throw(400, err);
    }

    // pass to next middleware.
    ctx.state.user = user;

    return next();
  } catch(e) {
    ctx.throw(500, e);
  }
};

export default registerMiddleware;
