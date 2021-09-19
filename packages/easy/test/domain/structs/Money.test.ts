import '@thisisagile/easy-test';
import { Currency, isMoney, money, Money } from '../../../src';

describe('Money', () => {

  const m = new Money({ currency: Currency.EUR.id, amount: 42 });

  test('default', () => {
    const m = new Money();
    expect(m.currency).toBe(Currency.EUR);
    expect(m.amount).toBe(0);
  });

  test('real money', () => {
    const m = new Money({ currency: Currency.USD.id, amount: 42 });
    expect(m.currency).toBe(Currency.USD);
    expect(m.amount).toBe(42);
  });

  test('add', () => {
    const m2 = m.add(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.amount).toBe(84);
  });

  test('subtract', () => {
    const m2 = m.subtract(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.amount).toBe(0);
  });

  test('times', () => {
    const m2 = m.times(4);
    expect(m2.currency).toBe(m.currency);
    expect(m2.amount).toBe(168);
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