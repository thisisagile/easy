import '@thisisagile/easy-test';
import { Currency, Money } from '../../../src';

describe('Currency', () => {

  test('amount', () => {
    const m = Currency.AUD.amount(42);
    expect(m).toBeInstanceOf(Money);
    expect(m.currency).toBe(Currency.AUD);
    expect(m.amount).toBe(42);
  });
});
