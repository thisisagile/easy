import { IBAN, isIBAN } from '../../../src';
import '@thisisagile/easy-test';

describe('isIBAN', () => {
  test('invalid', () => {
    expect(isIBAN()).toBeFalsy();
    expect(isIBAN('')).toBeFalsy();
    expect(isIBAN('0')).toBeFalsy();
    expect(isIBAN('NL82ABNA')).toBeFalsy();
  });

  test('valid', () => {
    expect(isIBAN('NL82ABNA6799312636')).toBeTruthy();
  });
});

describe('IBAN', () => {
  test('invalid', () => {
    expect(new IBAN('')).not.toBeValid();
    expect(isIBAN('NL82ABNA')).not.toBeValid();
  });

  test('valid', () => {
    expect(new IBAN('NL82ABNA6799312636')).toBeValid();
  });
});
