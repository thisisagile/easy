import { Struct } from '../Struct';
import { required } from '../../validation';
import { Currency } from '../enums';
import { isEmpty, text } from '../../types';

export class Money extends Struct {
  @required() readonly currency = Currency.byId<Currency>(this.state.currency);
  @required() readonly value = this.state.value as number;

  add(amount: number): Money {
    return money(this.currency, this.value + amount);
  }
  subtract(amount: number): Money {
    return money(this.currency, this.value - amount);
  }
  times(n: number): Money {
    return money(this.currency, this.value * n);
  }

  toString(): string {
    return text(this.currency?.code)
      .with(' ', this.value?.toFixed(this.currency?.digits ?? 2))
      .toString();
  }
}

export const money = (currency: Currency, value: number): Money => new Money({ currency: currency.id, value });

export const isMoney = (m?: unknown): m is Money => {
  return !isEmpty(m) && m instanceof Money;
};
