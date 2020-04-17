import * as Router from '@koa/router';
import mapper from '../../../lib/mapper';
import authorized from '../../../lib/middlewares/authorized';
import { checkDateFormat } from '../../../lib/datetime';
import { Link } from '../../../model/Link';

const links = new Router();

links.get('/', authorized, async (ctx) => {
  const date = ctx.request.query['date'];
  if (!(date && checkDateFormat(date))) {
    const error = new Error('InvalidDateFormat');
    error.message = 'The valid date format is YYYY-MM-DD';
    ctx.throw(400, error);
    return;
  }

  try {
    const links = [];

    for await (const link of mapper.query(
      Link,
      {
        subject: 'date',
        type: 'Equals',
        object: date,
      },
      { indexName: 'DateIndex', scanIndexForward: false },
    )) {
      links.push(link);
    }

    ctx.body = {
      links,
    };
  } catch (e) {
    ctx.throw(503, e);
  }
});

export default links;
