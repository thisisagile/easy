import { Id, text, Value } from '../../types';
import { Country } from '../enums';
import validator from 'validator';

export class PostalCode extends Value {
  constructor(postalCode?: unknown, readonly country: Country | Id = Country.NL) {
    super(text(postalCode).replace(' ', '').toString());
  }
  get isValid(): boolean {
    return validator.isPostalCode(this.value, (this.country instanceof Country ? this.country.id : text(this.country).upper) as validator.PostalCodeLocale);
  }
}

export const postalCode = (postalCode?: unknown, country: Country | Id = Country.NL) => new PostalCode(postalCode, country);
