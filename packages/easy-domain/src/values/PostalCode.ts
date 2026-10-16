import { Id, text, Value } from '@thisisagile/easy';
import { Country } from '../enums/Country';
import isPostalCodeModule, { PostalCodeLocale } from 'validator/lib/isPostalCode.js';
import { defaultExport } from '../utils/defaultExport';

const isPostalCode = defaultExport(isPostalCodeModule);

export class PostalCode extends Value {
  constructor(
    postalCode?: unknown,
    readonly country: Country | Id = Country.NL
  ) {
    super(text(postalCode).replace(' ', '').toString());
  }
  get isValid(): boolean {
    return isPostalCode(this.value, (this.country instanceof Country ? this.country.id : text(this.country).upper) as PostalCodeLocale);
  }
}

export const postalCode = (postalCode?: unknown, country: Country | Id = Country.NL) => new PostalCode(postalCode, country);
