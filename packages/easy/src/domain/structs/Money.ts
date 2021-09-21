import { Struct } from '../Struct';
import { required } from '../../validation';
import { Currency } from '../enums';
import { isEmpty } from '../../types';

export class Money extends Struct {
  @required() readonly currency: Currency = Currency.byId(this.state.currency, Currency.EUR);
  @required() readonly value: number = this.state.value ?? 0;

  add = (amount: number): Money => money(this.currency, this.value + amount);
  subtract = (amount: number): Money => money(this.currency, this.value - amount);
  times = (n: number): Money => money(this.currency, this.value * n);

  toString(): string {
    return `${this.currency.code} ${this.value?.toFixed(this.currency.digits)}`;
  }
}

export const money = (currency: Currency, value: number): Money => new Money({ currency: currency.id, value });

export const isMoney = (m?: unknown): m is Money => {
  return !isEmpty(m) && m instanceof Money;
};
