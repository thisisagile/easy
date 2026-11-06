import { isNotEmpty, text, Value } from '@thisisagile/easy';
import isVATModule from 'validator/lib/isVAT.js';
import { defaultExport } from '../utils/defaultExport';

const isVAT = defaultExport(isVATModule);

type CountryCode = Parameters<typeof isVAT>[1];

export class VAT extends Value {
  private readonly country: string;

  constructor(vat: unknown, country = 'NL') {
    const cleaned = text(vat).trim.replace('.', '').toString();
    super(cleaned);

    this.country = text(country).trim.upper.toString();
  }

  get isValid(): boolean {
    if (!isNotEmpty(this.value)) return false;
    // Callers pass free-form country strings; isVAT itself rejects codes it has no matcher for.
    return isVAT(this.value, this.country as CountryCode);
  }
}

export const vat = (v: unknown, country?: string): VAT => new VAT(v, country);
