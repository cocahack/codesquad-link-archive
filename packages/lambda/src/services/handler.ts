import { APIGatewayProxyHandler } from 'aws-lambda';
import * as moment from 'moment';
import 'source-map-support/register';

export const hello: APIGatewayProxyHandler = async (event, _context) => {

  const unixTime = moment().unix();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
      input: event,
      currentTime: unixTime,
    }, null, 2),
  };
};
