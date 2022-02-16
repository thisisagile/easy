import '@thisisagile/easy-test';
import { Amount, Currency, money, Money } from '../../../src';

const m = money(Currency.EUR, 15);
const a = new Amount({ quantity: 2, unitPrice: m });

describe('Amount', () => {
  test('constructor', () => {
    expect(a.quantity).toBe(2);
    expect(a.unitPrice).toBe(m);
  });

  test('total', () => {
    expect(a.total).toMatchText('€ 30.00');
  });

  test('toString', () => {
    expect(a).toMatchText('2 x € 15.00');
  });

  test('invalid', () => {
    expect(new Amount()).not.toBeValid();
    expect(new Amount({ unitPrice: m })).not.toBeValid();
    expect(new Amount({ quantity: 12, unitPrice: new Money({ currency: 'wrong', value: 1 }) })).not.toBeValid();
    expect(new Amount({ quantity: 12, unitPrice: m })).toBeValid();
  });
});
