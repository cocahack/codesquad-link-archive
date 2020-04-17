import { decodeToken, generateToken } from '../token';
import { verify } from 'jsonwebtoken';

describe('JWT util', () => {
  const invitationSecret = 'inv';
  const authSecret = 'auth';

  process.env.INVITATION_SECRET = invitationSecret;
  process.env.AUTH_SECRET = authSecret;

  describe('generateToken()', () => {

    it('should return the valid token', async () => {
      const payload = { name: 'test' };
      const token = await generateToken(payload, invitationSecret);

      verify(token, invitationSecret, (_err, decoded) => {
        expect(decoded).toMatchObject(payload);
      });
    });

  });

  describe('decodeToken()', () => {

    it('should decode a given token', async () => {
      const payload = { name: 'test' };
      const secret = authSecret;
      const token = await generateToken(payload, secret);

      await expect(decodeToken(token, secret)).resolves.toMatchObject(payload);
    });

  });

});
