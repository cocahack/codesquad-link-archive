import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Context, Middleware, Next } from 'koa';
import User, { IUser } from '../schema/User';
import { ACCESS_TOKEN_NAME, DEVELOPMENT_ENV, REFRESH_TOKEN_NAME } from './constants';
import logger from './logger';

export interface JwtPayload {
  alg: string;
  sub?: string;
  iat?: number;
  exp?: number;
  nbf?:	number;
  iss?:	string;
  aud?:	string;
  prn?:	string;	
  jti?:	string;	
  typ?:	string;
}

type AccessTokenPayload = {
  userId: string;
} & JwtPayload;

type RefreshTokenPayload = {
  userId: string;
  tokenId: string;
} & JwtPayload;

export type AuthTokens = {
  accessToken: string,
  refreshToken: string,
};


const { INVITATION_SECRET, AUTH_SECRET } = process.env;

if(!(INVITATION_SECRET && AUTH_SECRET)) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';
}

export const generateToken = (payload: any, options?: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'cocahack.me',
    expiresIn: '7d',
    ...options,
  };

  return new Promise((resolve, reject) => {
     jwt.sign(payload, AUTH_SECRET, jwtOptions, (err, token) => {
       if(err) {
         reject(err);
       } else {
         resolve(token);
       }
     });
  });
};


export const decodeToken = async <T extends Object>(token: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, AUTH_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
};

export function setTokenToCookie(
  ctx: Context,
  tokens: AuthTokens,
) {
  // set cookie
  ctx.cookies.set(ACCESS_TOKEN_NAME, tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    domain: '.cocahack.me'
  });

  ctx.cookies.set(REFRESH_TOKEN_NAME, tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 15,
    domain: '.cocahack.me'
  });

  if(process.env.NODE_ENV === DEVELOPMENT_ENV) {
    // Following codes are for webpack-dev-server proxy
    ctx.cookies.set(ACCESS_TOKEN_NAME, tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60
    });

    ctx.cookies.set(REFRESH_TOKEN_NAME, tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30
    });
  }
}

export const refresh = async (ctx: Context, refreshToken: string) => {
  try {
    const decoded = await decodeToken<RefreshTokenPayload>(refreshToken);
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) {
      const error = new Error('InvalidUserError');
      throw error;
    }
    const tokens = await refreshUserToken(decoded.tokenId, decoded.userId, decoded.exp, refreshToken);
    setTokenToCookie(ctx, tokens);
  } catch (e) {
    throw e;
  }
}

const refreshUserToken = async (
  tokenId: string,
  userId: string,
  refreshTokenExp: number,
  previousRefreshToken: string) => {
  const now = new Date().getTime();
  const diff = refreshTokenExp * 1000 - now;

  let refreshToken = previousRefreshToken;
  // renew refresh token if remaining life is less than 1d
  if (diff < 1000 * 60 * 60 * 24) {
    refreshToken = await generateToken({ tokenId, userId },
      {
        subject: REFRESH_TOKEN_NAME,
        expiresIn: '15d'
      }
    );
  }
  const accessToken = await generateToken({ userId },
    {
      subject: ACCESS_TOKEN_NAME,
      expiresIn: '1h'
    }
  );

  return { refreshToken, accessToken };
} 

export const consumeUser: Middleware = async (ctx: Context, next: Next) => {
  let accessToken: string | undefined = ctx.cookies.get(ACCESS_TOKEN_NAME);
  const refreshToken: string | undefined = ctx.cookies.get(REFRESH_TOKEN_NAME);

  const { authorization } = ctx.request.headers;

  // for bearer token
  if (!accessToken && authorization) {
    accessToken = authorization.split(' ')[1];
  }

  try {
    if (!accessToken) {
      return next();
    }
    const accessTokenData = await decodeToken<AccessTokenPayload>(accessToken);
    ctx.state.userId = accessTokenData.userId;
    ctx.state.userPayload = accessTokenData;

    // refresh token when life < 30mins
    const diff = accessTokenData.exp * 1000 - new Date().getTime();
    if (diff < 1000 * 60 * 30 && refreshToken) {
      await refresh(ctx, refreshToken);
      logger.info(`Tokens of User ${accessTokenData.userId} refreshed.`);
    }
  } catch (e) {
    // maybe fail to decode a token.
    console.error(e);
    ctx.throw(500, e);
  }

  return next();
};

export const createUserTokens = async (user: IUser): Promise<AuthTokens> => {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const accessToken = await generateToken({
    userId: user.userId,
  }, {
    expiresIn: '1h',
    subject: ACCESS_TOKEN_NAME,
  });

  const refreshToken = await generateToken({
    tokenId,
    userId: user.userId,
  }, {
    expiresIn: '15d',
    subject: REFRESH_TOKEN_NAME,
  });

  return { accessToken, refreshToken };
};
