import { vat, VAT } from '../../src';
import '@thisisagile/easy-test';

describe('VAT', () => {

  test('creates a VAT value', () => {
    const v = vat('NL 123456...789B01', 'NL');
    expect(v).toBeInstanceOf(VAT);
  });

  test('normalizes dots and trims input', () => {
    const v = vat('  NL12.34.56.78.9B01  ', 'NL');
    expect(v.value).toBe('NL123456789B01');
  });

  test('is valid for a correct VAT and country', () => {
    const v = vat('NL123456789B01', 'NL');
    expect(v.isValid).toBeTruthy();
  });

  test('is invalid for an incorrect VAT', () => {
    const v = vat('NL123', 'NL');
    expect(v.isValid).toBeFalsy();
  });

  test('is invalid for empty input', () => {
    const v = vat('', 'NL');
    expect(v.isValid).toBeFalsy();
  });

  test('respects country code', () => {
    const vatNL = vat('NL 8128.93.773.B.01', 'BE');
    const vatBE = vat('BE 0895.244.474', 'BE');
    expect(vatNL.isValid).toBeFalsy();
    expect(vatBE.isValid).toBeTruthy();
  });

  test('defaults to NL if country not provided', () => {
    const v = vat('NL123456789B01');
    expect(v.isValid).toBeTruthy();
  });
});
