import * as Router from '@koa/router';

import auth from './auth';
import users from './users';
import channels from './channels';
import links from './links';

const v1 = new Router();

v1.get('/check', ctx => {
  ctx.body = {
    version: 'v1'
  };
});

v1.get('/test', async ctx => {
  ctx.body = {
    user_id: ctx.state.user_id
  };
});

v1.use('/auth', auth.routes());
v1.use('/users', users.routes());
v1.use('/channels', channels.routes());
v1.use('/links', links.routes());

export default v1;
