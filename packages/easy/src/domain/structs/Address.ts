import { isEmpty, text } from '../../types';
import { Struct } from '../Struct';
import { required } from '../../validation';
import { Country } from '../enums';

export class Address extends Struct {
  @required() readonly street: string = this.state.street;
  @required() readonly houseNumber: string = this.state.houseNumber;
  readonly extension: string = this.state.extension;
  @required() readonly postalCode: string = this.state.postalCode;
  @required() readonly city: string = this.state.city;
  @required() readonly country: Country = Country.byId<Country>(this.state.country);

  toString(): string {
    return text(this.street, '')
      .add(this.houseNumber, ' ')
      .add(this.extension, ' ')
      .add(this.postalCode, ', ')
      .add(this.city, ' ')
      .add(this.country?.name, ' ')
      .toString();
  }
}

export const isAddress = (a?: unknown): a is Address => {
  return !isEmpty(a) && a instanceof Address;
};
