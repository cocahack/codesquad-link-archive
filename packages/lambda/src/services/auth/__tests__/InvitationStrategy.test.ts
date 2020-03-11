import { JwtStrategy } from "../strategy/JwtStrategy";
import { InvitationPayload, InvitationStrategy } from "../strategy/InvitationStrategy";

describe('Class: InvitationStrategy', () => {

  let strategy: JwtStrategy<InvitationPayload>;
  let secret: string;

  beforeAll(() => {
    secret = 'TEST SECRET';
    strategy = new InvitationStrategy(secret);
  });

  it('should succeed to verifying issued token', async () => {
    const subject = 'test';
    const token = await strategy.sign(subject);
    const payload = await strategy.verify(token);

    expect(payload.sub).toEqual(subject);

  });

  it('token expiration interval should be ten minutes', async () => {
    const subject = 'test';
    const token = await strategy.sign(subject);
    const payload = await strategy.verify(token);

    expect(payload.exp - payload.iat).toEqual(60 * 10);
  });

});
