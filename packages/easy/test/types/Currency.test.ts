import { isCurrency } from '../../src';

describe('Currency', () => {
  test('isCurrencyType', () => {
    expect(isCurrency('')).toBeFalsy();
    expect(isCurrency({})).toBeFalsy();
    expect(isCurrency('EUR')).toBeFalsy();
    expect(isCurrency({ id: 'USD', name: 'Dollar', digits: 2, code: '$' })).toBeTruthy();
  });
});
