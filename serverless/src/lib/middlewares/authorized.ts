import { Middleware } from 'koa';

const authorized: Middleware = (ctx, next) => {
  if (!ctx.state.userId) {
    ctx.status = 401;
    ctx.body = {
      name: 'NOT_AUTHORIZED'
    };
    return;
  }
  return next();
};

export default authorized;
