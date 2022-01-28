import { isEmpty, isNotEmpty, text } from '../../types';
import { Struct } from '../Struct';
import { required, valid } from '../../validation';
import { Country } from '../enums';
import { postalCode } from '../values';

export class Address extends Struct {
  @required() readonly street: string = this.state.street;
  @required() readonly houseNumber: string = this.state.houseNumber;
  readonly extension: string = this.state.extension;
  @valid() readonly postalCode = postalCode(this.state.postalCode, this.state.country);
  @required() readonly city: string = this.state.city;
  @required() readonly country: Country = Country.byId<Country>(this.state.country);

  toString(): string {
    return text(this.street, '')
      .add(this.houseNumber, ' ')
      .add(this.extension, ' ')
      .add(isNotEmpty(this.postalCode?.value) ? this.postalCode : undefined, ', ')
      .add(this.city, ' ')
      .add(this.country?.name, ' ')
      .toString();
  }
}

export const isAddress = (a?: unknown): a is Address => {
  return !isEmpty(a) && a instanceof Address;
};
