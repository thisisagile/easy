import { isEmpty, text, required, valid, Struct } from '@thisisagile/easy';
import { Country } from '../enums/Country';
import { postalCode } from '../values/PostalCode';

export class Address extends Struct {
  @required() readonly street = this.state.street as string;
  @required() readonly houseNumber = this.state.houseNumber as string;
  readonly extension = this.state.extension as string;
  @valid() readonly postalCode = postalCode(this.state.postalCode, this.state.country);
  @required() readonly city = this.state.city as string;
  @required() readonly country = Country.byId<Country>(this.state.country);

  toString(): string {
    return text(this.street)
      .with(' ', this.houseNumber, this.extension)
      .with(', ', text(this.postalCode).with(' ', this.city, this.country?.name))
      .toString();
  }
}

export const isAddress = (a?: unknown): a is Address => {
  return !isEmpty(a) && a instanceof Address;
};
