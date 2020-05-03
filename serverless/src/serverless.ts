import * as serverless from 'serverless-http';
import { APIGatewayProxyHandler } from 'aws-lambda';

import app from './app';

const serverlessApp = serverless(app);

export const handler: APIGatewayProxyHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = true;

  return await serverlessApp(event, context);
};
