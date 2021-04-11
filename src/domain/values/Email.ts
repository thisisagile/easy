import { Value } from '../../types';
import Validator from 'validatorjs';

export class Email extends Value {
  get isValid(): boolean {
    return isEmail(this.value);
  }
}

export const isEmail = (email?: unknown): boolean => {
  return !!new Validator({ email }, { email: 'required|email' }).passes();
};
