import { asString, isEmpty, Value } from '@thisisagile/easy';
import { isLength, isNumeric } from 'validator';

export class DunsNumber extends Value {
  constructor(duns?: unknown) {
    super(asString(duns).trim());
  }

  get isValid(): boolean {
    return isDunsNumber(this.value);
  }
}

export const duns = (d?: unknown): DunsNumber => new DunsNumber(d);

/**
 * Validate a D-U-N-S number using validator.js
 *  - Exactly 9 digits
 *  - No spaces or special chars
 */
export const isDunsNumber = (d?: unknown): boolean => !isEmpty(d) && isNumeric(d as string, { no_symbols: true }) && isLength(d as string, { min: 9, max: 9 });
