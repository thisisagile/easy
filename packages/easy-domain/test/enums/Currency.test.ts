import '@thisisagile/easy-test';
import { Currency } from '../../src';

describe('Currency', () => {
  test('byId is case sensitive and accepts only the actual id.', () => {
    expect(Currency.byId('EUR')).toBe(Currency.EUR);
    expect(Currency.byId('eur')).toBeUndefined();
  });
});
