import { JwtPayload } from 'lib/jwt/types';

export interface JwtStrategy<P extends JwtPayload> {
  verify: (token: string) => Promise<P>;
  sign: (subject: string) => Promise<string>;
}
