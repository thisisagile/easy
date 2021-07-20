import { Algorithm, decode, sign, verify } from 'jsonwebtoken';
import { ctx, Json, Value } from '../types';
import { rule } from '../validation';

export class Jwt extends Value {
  static sign = (token: Json): Jwt => {
    const privateKey = ctx.env.get('tokenPrivateKey');
    if (!privateKey) throw Error('Private key not found');
    return new Jwt(
      sign(token, privateKey, {
        expiresIn: ctx.env.get('tokenExpiresIn') ?? '1h',
        keyid: ctx.env.get('tokenKeyid') ?? 'easy',
        algorithm: ctx.env.get('tokenAlgorithm', 'RS256') as Algorithm,
      })
    );
  };

  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  decode = (): Json => decode(this.value) as Json;

  @rule('Token is not valid')
  verify(): boolean {
    try {
      verify(this.value, ctx.env.get('tokenPublicKey') ?? '');
      return true;
    } catch (e) {
      return false;
    }
  }

  toJSON(): Json {
    return { jwt: this.value };
  }
}
