import '@thisisagile/easy-test';
import { Currency, isMoney, money, Money } from '../../../src';

describe('Money', () => {
  const m = new Money({ currency: Currency.EUR.id, value: 42 });

  test('real money', () => {
    const m = new Money({ currency: Currency.USD.id, value: 42 });
    expect(m.currency).toBe(Currency.USD);
    expect(m.value).toBe(42);
  });

  test('add', () => {
    const m2 = m.add(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(84);
  });

  test('subtract', () => {
    const m2 = m.subtract(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(0);
  });

  test('times', () => {
    const m2 = m.times(4);
    expect(m2.currency).toBe(m.currency);
    expect(m2.value).toBe(168);
  });

  test('toString', () => {
    expect(m).toMatchText('€ 42.00');
    expect(money(Currency.GBP, 16)).toMatchText('£ 16.00');
  });

  test('invalid', () => {
    expect(new Money()).not.toBeValid();
    expect(new Money({currency: 'wrong'})).not.toBeValid();
    expect(new Money({currency: 'wrong', value: 0})).not.toBeValid();
    expect(new Money({value: 0})).not.toBeValid();
    expect(new Money({currency: 'EUR', value: 0})).toBeValid();
  });
});

describe('isMoney', () => {
  test('false', () => {
    expect(isMoney()).toBeFalsy();
    expect(isMoney({})).toBeFalsy();
    expect(isMoney('EUR')).toBeFalsy();
    expect(isMoney(42)).toBeFalsy();
  });
  test('true', () => {
    expect(isMoney(money(Currency.EUR, 42))).toBeTruthy();
  });
});
