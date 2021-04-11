import { asString, isEmpty, Value } from '../../types';
import validator from 'validator';

export class EAN extends Value {
  get isValid(): boolean {
    return isEAN(this.value);
  }
}

export const isEAN = (EAN?: unknown): boolean => {
  return !isEmpty(EAN) && validator.isEAN(asString(EAN));
};
