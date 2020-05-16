import * as Router from '@koa/router';
import Channel from '../../schema/channel';

const channels = new Router();

channels.get('/', async (ctx) => {
  try {
    const channels = await Channel.find();

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