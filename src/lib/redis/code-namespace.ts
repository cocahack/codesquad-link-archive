import { User } from '../../schema/user';
import { makeError } from '../error';
import redis from './redis';


export const saveCode = async (code: string, userId: User['userId']): Promise<void> => {
  await redis.multi()
    .hmset(addNamespacePrefix(code), userId)
    .expire(code, 60 * 10)
    .exec();
}

export const checkCode = async (code: string): Promise<string> => {
  const prependedCode = addNamespacePrefix(code);
  const result = await redis.multi()
  .hgetall(prependedCode)
  .del(prependedCode)
  .exec();

  /*
  * Check whether transaction fails.
  */
  if(result[0][0] || result[1][0] || result[1][1] !== 1) {
    throw makeError('Cannot fetch from REDIS.', '');
  } 

  return result[0][1];
}

const addNamespacePrefix = (code: string) => `code:${code}`;