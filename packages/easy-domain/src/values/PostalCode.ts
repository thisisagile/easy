import { Id, text, Value } from '@thisisagile/easy';
import { Country } from '../enums/Country';
import { isPostalCode, PostalCodeLocale } from 'validator';

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
