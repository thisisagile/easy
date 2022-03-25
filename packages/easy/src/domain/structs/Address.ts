import { isEmpty, text } from '../../types';
import { Struct } from '../Struct';
import { required, valid } from '../../validation';
import { Country } from '../enums';
import { postalCode } from '../values';

export class Address extends Struct {
  @required() readonly street = this.state.street as string;
  @required() readonly houseNumber = this.state.houseNumber as string;
  readonly extension = this.state.extension as string;
  @valid() readonly postalCode = postalCode(this.state.postalCode, this.state.country);
  @required() readonly city = this.state.city as string;
  @required() readonly country = Country.byId<Country>(this.state.country);

  toString(): string {
    return text(this.street).with(' ', this.houseNumber, this.extension).with(', ', text(this.postalCode).with(' ', this.city, this.country?.name)).toString();
  }
}

export const isAddress = (a?: unknown): a is Address => {
  return !isEmpty(a) && a instanceof Address;
};
