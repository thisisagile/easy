import { Country, postalCode, PostalCode } from '../../../src';
import '@thisisagile/easy-test';

const postalCodes = {
  NL: '1234AB',
  BE: '2000',
  PL: '10-123',
};

describe('PostalCode', () => {
  test('invalid', () => {
    expect(postalCode()).not.toBeValid();
    expect(postalCode('1234A')).not.toBeValid();
    expect(postalCode(postalCodes.NL, Country.BE)).not.toBeValid();
    expect(postalCode(postalCodes.NL, 'BE')).not.toBeValid();
    expect(postalCode(postalCodes.BE, 'XX')).not.toBeValid();
  });

  test('valid', () => {
    expect(postalCode(postalCodes.NL)).toBeValid();
    expect(postalCode(' 1234 AB ')).toBeValid();
    expect(postalCode(postalCodes.PL, Country.PL)).toBeValid();
    expect(postalCode(postalCodes.NL, Country.NL)).toBeValid();
    expect(postalCode(postalCodes.BE, Country.BE)).toBeValid();
    expect(postalCode(postalCodes.BE, 'BE')).toBeValid();
    expect(postalCode(postalCodes.BE, 'be')).toBeValid();
  });

  test('toJson', () => {
    expect(postalCode('1024AB', Country.NL).toJSON()).toBe('1024AB');
  });
});
