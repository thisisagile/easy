import { EAN, isEAN } from '../../src';
import '@thisisagile/easy-test';

describe('isEAN', () => {
  test('invalid', () => {
    expect(isEAN()).toBeFalsy();
    expect(isEAN('')).toBeFalsy();
    expect(isEAN('0')).toBeFalsy();
    expect(isEAN('90117')).toBeFalsy();
  });

  test('valid', () => {
    expect(isEAN('90311017')).toBeTruthy();
    expect(isEAN('9780201379624')).toBeTruthy();
  });
});

describe('EAN', () => {
  test('EAN13 valid length, valid checksum', () => {
    expect(new EAN('9780201379624')).toBeValid();
    expect(new EAN('7072506210040')).toBeValid();
  });

  test('EAN8 valid length, valid checksum', () => {
    expect(new EAN('90311017')).toBeValid();
  });

  test('EAN13 invalid length, invalid checksum', () => {
    expect(new EAN('80201379624')).not.toBeValid();
    expect(new EAN('')).not.toBeValid();
    expect(new EAN(undefined as any)).not.toBeValid();
  });

  test('EAN8 invalid length, invalid checksum', () => {
    expect(new EAN('90117')).not.toBeValid();
  });

  test('EAN13 valid length, invalid checksum', () => {
    expect(new EAN('9780201379623')).not.toBeValid();
  });

  test('EAN8 valid length, invalid checksum', () => {
    expect(new EAN('90311010')).not.toBeValid();
  });
});
