import redis from '../redis';

describe('Redis test', () => {
  const data = {
    a: '1',
    b: '2',
  };
  const key = 'testkey';

  it('hmset test', async () => {
    await expect(redis.hmset(key, data)).resolves.toMatch('OK');
  });

  it('hgetall test', async () => {
    await expect(redis.hgetall(key)).resolves.toMatchObject(data);
  });

  it('transaction test', async () => {
    const result = await redis.multi()
      .hgetall(key)
      .del(key)
      .exec();
    console.dir(result, { depth: 4 });
    expect(result[0][1]).toMatchObject(data);
    expect(result[1][1]).toBe(1);
  });

  afterAll(async () => {
    await redis.quit();
  });
});