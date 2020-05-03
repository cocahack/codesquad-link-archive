import { DataMapper } from '@aws/dynamodb-data-mapper';
import * as DynamoDB from 'aws-sdk/clients/dynamodb'

const initDataMapper = () => {
  const stage = process.env.STAGE || 'dev';
  const region = process.env.REGION;

  return new DataMapper({
    client: stage === 'prod' ? new DynamoDB({ region } ) : new DynamoDB({ region: 'us-east-1', endpoint: 'http://localhost:8000' }),
    tableNamePrefix: `${stage}-`,
  });
};

export default initDataMapper();
