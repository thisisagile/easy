import { Struct } from '../Struct';
import { required } from '../../validation';
import { Currency } from '../enums';

export class Money extends Struct {
  @required() readonly currency: Currency = Currency.byId(this.state.currency, Currency.EUR);
  @required() readonly amount = this.state.amount ?? 0;
}