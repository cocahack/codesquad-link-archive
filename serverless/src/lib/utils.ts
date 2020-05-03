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

export const makeError = (message: string, name?: string) => {
  const err = new Error(message);
  if (name) {
    err.name = name;
  }
  return err;
};
