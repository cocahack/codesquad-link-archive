import * as Router from '@koa/router';
import User from '../../../schema/User';

const users = new Router();

users.get('/', async (ctx) => {
  try {
    const users = await User.find();

    ctx.status = 200;
    ctx.body = {
      users,
    };
  } catch (e) {
    console.error(e);
    ctx.throw(500, e);
  }
});

export default users;