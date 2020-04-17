import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Context, Middleware } from 'koa';

import { JWT_ISSUER } from './constants';
import { User } from '../model/User';

const { INVITATION_SECRET, AUTH_SECRET } = process.env;

if(!(INVITATION_SECRET && AUTH_SECRET)) {
  const error = new Error('InvalidSecretKeyError');
  error.message = 'Secret key for JWT is missing.';
}

export const generateToken = (payload: any, secretKey: string, options?: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: JWT_ISSUER,
    expiresIn: '7d',
    ...options,
  };

  return new Promise((resolve, reject) => {
     if(!secretKey) return;
     jwt.sign(payload, secretKey, jwtOptions, (err, token) => {
       if(err) {
         reject(err);
       } else {
         resolve(token);
       }
     });
  });
};


export const decodeToken = async <T extends Object>(token: string, secretKey: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    if (!secretKey) return;
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
};

export function setTokenCookie(
  ctx: Context,
  tokens: { accessToken: string; refreshToken: string }
) {
  // set cookie
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    domain: '.cocahack.me'
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    domain: '.cocahack.me'
  });

  // Following codes are for webpack-dev-server proxy
  ctx.cookies.set('access_token', tokens.accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  });

  ctx.cookies.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

export const consumeUser: Middleware = async (ctx: Context, next) => {
  let accessToken: string | undefined = ctx.cookies.get('access_token');

  const { authorization } = ctx.request.headers;

  // for bearer token
  if (!accessToken && authorization) {
    accessToken = authorization.split(' ')[1];
  }

  try {
    if (!accessToken) {
      return next();
    }
    const accessTokenData = await decodeToken<User>(accessToken, AUTH_SECRET);
    ctx.state.userId = accessTokenData.userId;
    // refresh token when life < 30mins
    // const diff = accessTokenData.exp * 1000 - new Date().getTime();
    // if (diff < 1000 * 60 * 30 && refreshToken) {
    //   await refresh(ctx, refreshToken);
    // }
  } catch (e) {
    // maybe fail to decode a token.
    console.error(e);
    ctx.throw(500, e);
  }

  return next();
};
