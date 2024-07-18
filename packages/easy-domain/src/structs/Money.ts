import { Struct, isEmpty, text, required } from '@thisisagile/easy';
import { Currency } from '../enums/Currency';

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

  static zero(currency: Currency): Money {
    return Money.amount(currency);
  }

  static amount(currency: Currency, value: number = 0): Money {
    return money(currency, value);
  }
}

export const money = (currency: Currency, value: number): Money => new Money({ currency: currency.id, value });

export const isMoney = (m?: unknown): m is Money => {
  return !isEmpty(m) && m instanceof Money;
};
