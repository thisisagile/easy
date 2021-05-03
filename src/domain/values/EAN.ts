import { asString, isEmpty, Value } from '../../types';
import validator from 'validator';

export class EAN extends Value {
  get isValid(): boolean {
    return isEAN(this.value);
  }
}

export const isEAN = (ean?: unknown): boolean => {
  return !isEmpty(ean) && validator.isEAN(asString(ean));
};
