import * as koaCash from 'koa-cash';
import logger from '../logger';
import redis from '../redis/redis';

const setCache = (key: string, value: any, maxAge: number) => {
  if (maxAge <= 0) {
    return redis.set(key, JSON.stringify(value));
  }
  return redis.set(key, JSON.stringify(value), 'PX', maxAge);
};

const getCache = async (key: string) => {
  const value = await redis.get(key);
  if(value) {
    logger.debug(`Values of Key(${key}) read from Cache.`);
  }
  return JSON.parse(value);
};

const koaCache = koaCash({
  maxAge: 1000 * 60 * 10,
  set: setCache,
  get: getCache,
});

export default koaCache;
