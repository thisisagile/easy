import { ctx } from '@thisisagile/easy';
import { toVAT, VAT } from '../../src';
import '@thisisagile/easy-test';

describe('VAT', () => {
  beforeEach(() => {
    (ctx as any).request = { shopCode: 'NL' };
  });

  afterEach(() => {
    (ctx as any).request = undefined;
  });

  test('creates a VAT value', () => {
    const vat = toVAT('NL123456789B01');
    expect(vat).toBeInstanceOf(VAT);
  });

  test('normalizes dots and trims input', () => {
    const vat = toVAT('  NL12.34.56.78.9B01  ');
    expect(vat.value).toBe('NL123456789B01');
  });

  test('is valid for a correct VAT and shopCode', () => {
    const vat = toVAT('NL123456789B01');
    expect(vat.isValid).toBeTruthy();
  });

  test('is invalid without shopCode in ctx', () => {
    (ctx as any).request = {};
    const vat = toVAT('NL123456789B01');
    expect(vat.isValid).toBeFalsy();
  });

  test('is invalid for an incorrect VAT', () => {
    const vat = toVAT('NL123');
    expect(vat.isValid).toBeFalsy();
  });

  test('is invalid for empty input', () => {
    const vat = toVAT('');
    expect(vat.isValid).toBeFalsy();
  });

  test('respects shopCode country', () => {
    (ctx as any).request = { shopCode: 'BE' };
    const vatNL = toVAT('NL 8128.93.773.B.01');
    const vatBE = toVAT('BE 0895.244.474');
    expect(vatNL.isValid).toBeFalsy();
    expect(vatBE.isValid).toBeTruthy();
  });
});
