import { asString, isEmpty, Value } from '../../types';
import { isIBAN as validateIBAN } from 'validator';

export class IBAN extends Value {
  get isValid(): boolean {
    return isIBAN(this.value);
  }
}

export const isIBAN = (iban?: unknown): boolean => {
  return !isEmpty(iban) && validateIBAN(asString(iban));
};
