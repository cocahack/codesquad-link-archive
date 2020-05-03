import * as Router from '@koa/router';
import mapper from '../../../lib/mapper';
import authorized from '../../../lib/middlewares/authorized';
import { Channel } from '../../../model/Channel';

const channels = new Router();

channels.get('/', authorized, async (ctx) => {
  try {
    const channels = [];

    for await (const user of mapper.scan(Channel)) {
      channels.push(user);
    }

    ctx.status = 200;
    ctx.body = {
      channels,
    };
  } catch (e) {
    console.error(e);
    ctx.throw(500, e);
  }
});

export default channels;
