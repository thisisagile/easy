import { choose, isDefined, isEmpty, isString, isNumberFormat, Optional, required, Struct, text, use, isNumber } from '@thisisagile/easy';
import { Currency } from '../enums/Currency';

export class Money extends Struct {
  @required() readonly currency = Currency.byId<Currency>(this.state.currency);
  @required() readonly value = this.state.value as number;

  static zero(currency: Currency): Money {
    return Money.amount(currency);
  }

  static amount(currency: Currency, value: number = 0): Money {
    return money(currency, value);
  }

  static parse(value: unknown): Optional<Money> {
    return choose(value)
      .type(isMoney, m => m as Optional<Money>)
      .type(isMoneyFormat, v => Money.amount(currencyOr(v), stripCurrency(v)))
      .type(isNumberFormat, v => Money.amount(Currency.EUR, stripCurrency(v)))
      .type(isNumber, v => Money.amount(Currency.EUR, v))
      .else(() => undefined);
  }

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

const currency = (value: string): Optional<Currency> => Currency.all<Currency>().find(c => value.includes(c.code));

export const currencyOr = (value: string, alt: Currency = Currency.EUR): Currency => currency(value) ?? alt;

const normalizeDecimals = (value: string): string => {
  const [decimal, grouping] = value.lastIndexOf(',') > value.lastIndexOf('.') ? [',', '.'] : ['.', ','];
  return value.replaceAll(grouping, '').replace(decimal, '.');
};

export const stripCurrency = (value: string): number => parseFloat(normalizeDecimals(value.replace(currencyOr(value).code, '').trim()));

export const money = (currency: Currency, value: number): Money => new Money({ currency: currency.id, value });

export const isMoney = (m?: unknown): m is Money => {
  return !isEmpty(m) && m instanceof Money;
};

export const isMoneyFormat = (value?: unknown): value is string =>
  isString(value) &&
  use(
    currency(value),
    cur => isDefined(cur) && isNumberFormat(value.replace(cur.code, ''))
  );
