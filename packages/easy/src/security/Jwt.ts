import { Algorithm, decode, sign, verify } from 'jsonwebtoken';
import { Optional } from '../types/Types';
import { OneOrMore } from '../types/Array';
import { Value } from '../types/Value';
import { Validatable } from '../types/Validatable';
import { tryTo } from '../types/Try';
import { ctx } from '../types/Context';
import { Json } from '../types/Json';

interface SignOptions {
  audience?: Optional<OneOrMore<string>>;
  issuer?: Optional<string>;
}
export class Jwt extends Value implements Validatable {
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

  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  decode = (): Json => decode(this.value) as Json;

  toJSON(): Json {
    return { jwt: this.value };
  }
}
