import * as Router from '@koa/router';
import auth from './auth';
import channels from './channels';
import links from './links';
import users from './users';


const v1 = new Router();

v1.get('/check', ctx => {
  ctx.body = {
    version: 'v1'
  };
});

v1.use('/auth', auth.routes());
v1.use('/users', users.routes());
v1.use('/channels', channels.routes());
v1.use('/links', links.routes());

export default v1;
