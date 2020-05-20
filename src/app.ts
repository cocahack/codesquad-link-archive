import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import koaCache from './lib/cache/koa-cache';
import { consumeUser } from './lib/token';
import cacheMiddleware from './middlewares/cache';
import cors from './middlewares/cors';
import routes from './routes';
const compress = require('kompression');

const app = new Koa();

/* setup middlewares */
app.use(koaCache);
app.use(logger());
app.use(cors);
app.use(bodyParser());
app.use(consumeUser);
app.use(cacheMiddleware);
app.use(routes.routes()).use(routes.allowedMethods());
app.use(compress());

export default app;
