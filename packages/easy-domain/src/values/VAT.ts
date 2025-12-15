import { ctx, isNotEmpty, text, Value, replaceAll } from '@thisisagile/easy';
import { isVAT } from 'validator';

export class VAT extends Value {
  constructor(vat?: unknown) {
    const cleaned = replaceAll(text(vat).trim, '.', '');
    super(cleaned.toString());
  }

  get isValid(): boolean {
    const shopCode = (ctx.request as any)?.shopCode;
    if (!shopCode || !isNotEmpty(this.value)) return false;
    return isVAT(this.value, shopCode);
  }
}

export const toVAT = (vat?: unknown): VAT => new VAT(vat);
