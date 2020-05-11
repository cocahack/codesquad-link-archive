// System constants
export const DEVELOPMENT_ENV = 'development';
export const BASE_URL =
  process.env.NODE_ENV === DEVELOPMENT_ENV
    ? 'http://localhost:4000/'
    : 'https://link-api.cocahack.me';
export const DOMAIN_NAME = '.cocahack.me';

// Slack constants
export const SLACK_BOT_NAME = 'Jake(BE) Bot';
export const INVITE_MESSAGE = (url: string) =>
  `Codesquad 링크 저장소 <${url}|초대 링크>\n:warning: 주의: 10분 후 링크가 만료됩니다.`;

// JWT constants
export const JWT_ISSUER = 'cocahack.me';
export const INVITATION_QUERY_NAME = 'invitation';
export const ACCESS_TOKEN_NAME = 'access_token';
