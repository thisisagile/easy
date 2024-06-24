import { Algorithm, sign, verify } from 'jsonwebtoken';
import { ctx, Json, OneOrMore, Optional, tryTo, Validatable, Jwt as JwtBase } from '@thisisagile/easy';

interface SignOptions {
  audience?: Optional<OneOrMore<string>>;
  issuer?: Optional<string>;
}
export class Jwt extends JwtBase implements Validatable {
  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  get isValid(): boolean {
    return (
      tryTo(() => ctx.env.get('tokenPublicKey') ?? '')
        .map(key => verify(this.value, key))
        .map(() => true)
        .orElse() ?? false
    );
  }

  static sign = (token: Json, options?: SignOptions): Jwt =>
    tryTo(() => ctx.env.get('tokenPrivateKey') ?? '')
      .is.not.empty()
      .map(key =>
        sign(token, key, {
          ...options,
          expiresIn: ctx.env.get('tokenExpiresIn') ?? '1h',
          keyid: ctx.env.get('tokenKeyid') ?? 'easy',
          algorithm: ctx.env.get('tokenAlgorithm', 'RS256') as Algorithm,
        })
      )
      .map(s => new Jwt(s)).value;
}
