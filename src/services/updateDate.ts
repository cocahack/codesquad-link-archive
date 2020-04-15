import { APIGatewayProxyHandler } from 'aws-lambda';
import { Link } from 'lib/model/Link';
import mapper from 'lib/mapper';
import { getDateFromISOString } from 'lib/datetime';

export const updateDate: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const links: Link[] = [];

    for await (const link of mapper.scan(Link)) {
      links.push(link);
    }

    links.forEach(
      link => (link.date = getDateFromISOString(link.linkTimestamp)),
    );

    for await (const _persisted of mapper.batchPut(links)) {
    }

    return {
      statusCode: 200,
      body: 'The Date attribute updated!',
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
          message: 'Fail to update a date',
          stackTrace: process.env.STAGE === 'dev' ? e.stack : null,
          event,
        },
        null,
        2,
      ),
    };
  }
};
