import { asString, isEmpty, Value } from '../../types';
import validator from 'validator';

export class IBAN extends Value {
  get isValid(): boolean {
    return isIBAN(this.value);
  }
}

export const isIBAN = (iban?: unknown): boolean => {
  return !isEmpty(iban) && validator.isIBAN(asString(iban));
};
