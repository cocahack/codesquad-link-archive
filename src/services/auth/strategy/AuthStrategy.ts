import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { UserService } from '../../api/user/UserService';
import { JwtStrategy } from './JwtStrategy';
import { AuthPayload } from './AuthPayload';

export class AuthStrategy implements JwtStrategy<AuthPayload> {
  constructor(
    private readonly service: UserService,
    private readonly secret: string,
  ) {}

  verify(token: string) {
    return new Promise<AuthPayload>((resolve, reject) => {
      jwt.verify(token, this.secret, (err, decoded: AuthPayload) => {
        err ? reject(err) : resolve(decoded);
      });
    });
  }

  async sign(subject: string) {
    const user = await this.service.getUserById(subject);

    return new Promise<string>((resolve, reject) => {
      const payload: AuthPayload = {
        id: subject,
        name: user.userName,
        image: user.userImage,
      };

      const signOptions: SignOptions = {
        subject,
        expiresIn: '7d',
      };

      jwt.sign(payload, this.secret, signOptions, (err, encoded) => {
        err ? reject(err) : resolve(encoded);
      });
    });
  }
}
