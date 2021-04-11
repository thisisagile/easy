import { asString, isEmpty, Value } from '../../types';
import validator from 'validator';

export class Email extends Value {
  get isValid(): boolean {
    return isEmail(this.value);
  }
}

export const isEmail = (email?: unknown): boolean => {
  return !isEmpty(email) && validator.isEmail(asString(email));
};
