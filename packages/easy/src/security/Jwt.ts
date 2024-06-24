import { jwtDecode as decode } from 'jwt-decode';
import { Json, Value } from '../types';

export class Jwt extends Value {
  static of = (a: { jwt: string }): Jwt => new Jwt(a.jwt);

  decode = (): Json => decode(this.value);

  toJSON(): Json {
    return { jwt: this.value };
  }
}
