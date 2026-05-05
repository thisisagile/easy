import validateEAN from 'validator/lib/isEAN';
import { asString, isEmpty, Value } from '@thisisagile/easy';

export class EAN extends Value {
  get isValid(): boolean {
    return isEAN(this.value);
  }
}

export const isEAN = (ean?: unknown): boolean => {
  return !isEmpty(ean) && validateEAN(asString(ean));
};
