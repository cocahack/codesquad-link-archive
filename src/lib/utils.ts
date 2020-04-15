import { CustomAuthorizerResult } from 'aws-lambda';

export const buildIAMPolicy = (
  userId,
  effect,
  resource,
  context,
): CustomAuthorizerResult => {
  return {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };
};
