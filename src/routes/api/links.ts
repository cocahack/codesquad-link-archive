import * as Router from '@koa/router';
import Link from '../../schema/link';
import authorized from '../../middlewares/auth/authorized';

const links = new Router();

const PAGE_SIZE = 10;

links.get('/', authorized, async (ctx) => {
  try {
    const page = ctx.request.query.page || 1;

    const links = await Link.find()
    .sort({ linkTimestamp: -1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE);

    ctx.status = 200;
    ctx.body = {
      links,
    };
  } catch (e) {
    console.error(e);
    ctx.throw(500, e);
  }
});

export default links;
