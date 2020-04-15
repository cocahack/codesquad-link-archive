import { JwtPayload } from '../../../lib/jwt/types';

export interface AuthPayload extends JwtPayload {
  id: string;
  name: string;
  image?: string;
}
