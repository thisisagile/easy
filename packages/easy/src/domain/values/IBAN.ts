import { asString, isEmpty, Value } from '../../types';
import validateIBAN from 'validator/lib/isIBAN';

export class IBAN extends Value {
  get isValid(): boolean {
    return isIBAN(this.value);
  }
}

export const isIBAN = (iban?: unknown): boolean => {
  return !isEmpty(iban) && validateIBAN(asString(iban));
};
