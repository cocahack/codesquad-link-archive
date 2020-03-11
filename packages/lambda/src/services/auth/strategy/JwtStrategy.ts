export interface JwtStrategy<P extends JwtPayload> {
  verify: (token: string | Buffer) => Promise<P>;
  sign: (subject: string) => Promise<string>;
}
