import { Json, Value } from '../types';
import { jwtDecode as decode } from 'jwt-decode';

export class Jwt extends Value {
  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  decode = (): Json => decode(this.value) as Json;

  toJSON(): Json {
    return { jwt: this.value };
  }
}
