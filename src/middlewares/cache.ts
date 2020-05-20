import { Middleware } from 'koa';

const cacheMiddleware: Middleware = async (ctx, next) => {
  if (await ctx.cashed()) return;
  return next();
}

export default cacheMiddleware;
