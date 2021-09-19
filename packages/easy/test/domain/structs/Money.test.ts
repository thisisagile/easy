import '@thisisagile/easy-test';
import { Currency, Money } from '../../../src';

describe('Money', () => {

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
});
