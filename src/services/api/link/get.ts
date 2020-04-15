import { APIGatewayProxyHandler } from 'aws-lambda';
import { Link } from 'lib/model/Link';
import mapper from 'lib/mapper';
import * as moment from 'moment-timezone';
import { checkDateFormat } from '../../../lib/datetime';

export const get: APIGatewayProxyHandler = async (event, _context) => {
  try {
    let date = event.queryStringParameters?.date;

    if (!date) {
      date = moment()
        .subtract(1, 'd')
        .tz('Asia/Seoul')
        .format('YYYY-MM-DD');
    }

    if(!checkDateFormat(date)) {
      throw new Error('Request format is invalid.');
    }

    const links = [];

    for await (const link of mapper.query(Link, {
      subject: 'date',
      type: 'Equals',
      object: date,
    }, { indexName: 'DateIndex', scanIndexForward: false })) {
      links.push(link);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(links, null, 2),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: e.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          message: "Couldn't fetch the links.",
          stackTrace: process.env.STAGE === 'dev' ? e.stack : null,
          event,
        },
        null,
        2,
      ),
    };
  }
};
