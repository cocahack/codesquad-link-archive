import * as Router from '@koa/router';
import mapper from '../../../lib/mapper';
import { User } from '../../../model/User';
import authorized from '../../../lib/middlewares/authorized';

const users = new Router();

users.get('/', authorized, async (ctx) => {
  try {
    const users = [];

    for await (const user of mapper.scan(User)) {
      users.push(user);
    }

    ctx.status = 200;
    ctx.body = {
      users,
    };
  } catch (e) {
    ctx.throw(503, e);
  }
});

export default users;
