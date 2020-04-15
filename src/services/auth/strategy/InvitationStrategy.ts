import * as jwt from 'jsonwebtoken';
import { JwtStrategy } from './JwtStrategy';
import { InvitationPayload } from './InvitationPayload';

export class InvitationStrategy implements JwtStrategy<InvitationPayload> {
  constructor(private readonly secret: string) {}

  verify(token: string) {
    return new Promise<InvitationPayload>((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded: InvitationPayload) => {
        err ? reject(err) : resolve(decoded);
      });
    });
  }

  sign(subject: string) {
    return new Promise<string>((resolve, reject) => {
      const signOptions: jwt.SignOptions = {
        subject,
        expiresIn: '10m',
      };

      jwt.sign({}, this.secret, signOptions, (err, encoded) => {
        err ? reject(err) : resolve(encoded);
      });
    });
  }
}
