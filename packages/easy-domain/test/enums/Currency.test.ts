import '@thisisagile/easy-test';
import Currency from '../../src/entries/Currency';
import { isCurrency } from '@thisisagile/easy';

describe('Currency', () => {
  test('byId is case sensitive and accepts only the actual id.', () => {
    expect(Currency.byId('EUR')).toBe(Currency.EUR);
    expect(Currency.byId('eur')).toBeUndefined();
  });

  test('isCurrency', () => {
    expect(isCurrency(Currency.EUR)).toBeTruthy();
  });

  test('creates custom currencies', () => {
    const currency = Currency.create('TST', 'Test', 2, 'T');

    expect(currency).toBeInstanceOf(Currency.Enum);
    expect(currency.code).toBe('T');
  });

  test('queries the explicit catalogue', () => {
    expect(Currency.byIds(['EUR', 'missing'])).toEqual([Currency.EUR]);
    expect(Currency.first(currency => currency.id === 'GBP')).toBe(Currency.GBP);
  });
});
