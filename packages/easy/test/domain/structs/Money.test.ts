import '@thisisagile/easy-test';
import { Currency, Money } from '../../../src';

describe('Money', () => {

  const m = new Money({currency: Currency.EUR.id, amount: 42 });

  test('default', () => {
    const m = new Money();
    expect(m.currency).toBe(Currency.EUR);
    expect(m.amount).toBe(0);
  });

  test('real money', () => {
    const m = new Money({currency: Currency.USD.id, amount: 42 });
    expect(m.currency).toBe(Currency.USD);
    expect(m.amount).toBe(42);
  });

  test('add', () => {
    const m2 = m.add(42);
    expect(m2.currency).toBe(m.currency);
    expect(m2.amount).toBe(84);
  });
});
