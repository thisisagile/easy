import { isNotEmpty, text, Value } from '@thisisagile/easy';
import { isVAT } from 'validator';

export class VAT extends Value {
  private readonly country: string;

  constructor(vat: unknown, country = 'NL') {
    const cleaned = text(vat).trim.replace('.', '').toString();
    super(cleaned);

    this.country = text(country).trim.upper.toString();
  }

  get isValid(): boolean {
    if (!isNotEmpty(this.value)) return false;
    return isVAT(this.value, this.country);
  }
}

export const vat = (v: unknown, country?: string): VAT => new VAT(v, country);
