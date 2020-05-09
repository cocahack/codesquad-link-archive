import * as Router from '@koa/router';
import api from './api';

const routes = new Router();

routes.use('/v1', api.routes());

export default routes;
