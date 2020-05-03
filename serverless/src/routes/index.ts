import * as Router from '@koa/router';
import api from './api';

const routes = new Router();

routes.use('/v1', api.routes());
routes.get('/', ctx => {
  ctx.body = 'hello world!';
});

export default routes;
