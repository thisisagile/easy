import { Algorithm, decode, sign, verify } from 'jsonwebtoken';
import { ctx, Json, tryTo, Validatable, Value } from '../types';

interface SignOptions {
  audience?: string | string[] | undefined;
  issuer?: string | undefined;
}
export class Jwt extends Value implements Validatable {

  get isValid(): boolean {
    return tryTo(() => (ctx.env.get('tokenPublicKey') ?? ''))
      .map(key => verify(this.value, key))
      .map(() => true).orElse() ?? false;
  }

  static sign = (token: Json, options?: SignOptions): Jwt =>
    tryTo(() => ctx.env.get('tokenPrivateKey') ?? '').is.not.empty()
      .map(key => sign(token, key, {
        ...options,
        expiresIn: ctx.env.get('tokenExpiresIn') ?? '1h',
        keyid: ctx.env.get('tokenKeyid') ?? 'easy',
        algorithm: ctx.env.get('tokenAlgorithm', 'RS256') as Algorithm,
      }))
      .map(s => new Jwt(s)).value;

  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  decode = (): Json => decode(this.value) as Json;

  toJSON(): Json {
    return { jwt: this.value };
  }
}
