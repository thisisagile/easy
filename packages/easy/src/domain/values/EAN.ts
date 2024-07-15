import { asString, isEmpty, Value } from '../../types';
import { isEAN as validateEAN } from 'validator';

export class EAN extends Value {
  get isValid(): boolean {
    return isEAN(this.value);
  }
}

export const isEAN = (ean?: unknown): boolean => {
  return !isEmpty(ean) && validateEAN(asString(ean));
};
