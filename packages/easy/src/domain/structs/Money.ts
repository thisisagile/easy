import { Struct } from '../Struct';
import { required } from '../../validation';
import { Currency } from '../enums';
import { isEmpty } from '../../types';

export class Money extends Struct {
  @required() readonly currency: Currency = Currency.byId(this.state.currency, Currency.EUR);
  @required() readonly amount: number = this.state.amount ?? 0;

  add = (amount: number): Money => money(this.currency, this.amount + amount);
}

export const money = (currency: Currency, amount: number): Money => new Money({ currency, amount });

export const isMoney = (m?: unknown): m is Money => {
  return !isEmpty(m) && m instanceof Money;
};
