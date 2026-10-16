import isIBANModule from 'validator/lib/isIBAN.js';
import { asString, isEmpty, Value } from '@thisisagile/easy';
import { defaultExport } from '../utils/defaultExport';

const validateIBAN = defaultExport(isIBANModule);

export class IBAN extends Value {
  get isValid(): boolean {
    return isIBAN(this.value);
  }
}

export const isIBAN = (iban?: unknown): boolean => {
  return !isEmpty(iban) && validateIBAN(asString(iban));
};
