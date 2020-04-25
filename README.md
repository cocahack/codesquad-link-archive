# Codesquad Link Archive

![Deploy projects](https://github.com/cocahack/codesquad-link-archive/workflows/Deploy%20projects/badge.svg?branch=master)
![Node.js CI](https://github.com/cocahack/codesquad-link-archive/workflows/Node.js%20CI/badge.svg)

Codesquad Link Archive is an archive service for Codesquad Slack Users.
It provides users who use the free plan with links that cannot be viewed after a period.

## Architecture

![architecture](./images/sla-architecture.jpg)

## Project Stack

- Node.js
- TypeScript
- koa.js
- dynamodb-data-mapper-js
- Serverless Framework
- AWS
    - Lambda
    - API Gateway
    - DynamoDB
    - CloudWatch

