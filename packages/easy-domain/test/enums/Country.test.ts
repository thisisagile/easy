import '@thisisagile/easy-test';
import { toList } from '@thisisagile/easy';
import { Country, inEurope } from '../../src';

describe('Country', () => {
  test('id and name matches.', () => {
    expect(Country.NL.id).toBe('NL');
    expect(Country.NL.name).toMatchText('Netherlands');
  });

  test('short matches.', () => {
    expect(Country.NL).toMatchText('NL');
  });

  test('byId is case sensitive and accepts only the actual id.', () => {
    expect(Country.byId('NL')).toBe(Country.NL);
    expect(Country.byId('nl')).toBeUndefined();
  });

  test('lookup is not case sensitive and accepts both dashes as well as underscores.', () => {
    expect(Country.lookup('NL')).toBe(Country.NL);
    expect(Country.lookup('nl')).toBe(Country.NL);
    expect(Country.lookup('nl-')).toBe(Country.NL);
    expect(Country.lookup('nl_')).toBe(Country.NL);
  });

  test('byIds.', () => {
    expect(Country.byIds(['NL'])).toMatchText(toList<Country>(Country.NL));
  });

  test('equals.', () => {
    expect(Country.NL.equals(Country.NL)).toBeTruthy();
    expect(Country.NL.equals('nl')).toBeTruthy();
    expect(Country.NL.equals('NL')).toBeTruthy();
    expect(Country.NL.equals('BE')).toBeFalsy();
  });

  test('returns true for EU countries.', () => {
    expect(inEurope(Country.NL)).toBeTruthy();
    expect(inEurope(Country.DE)).toBeTruthy();
    expect(inEurope('IT')).toBeTruthy();
    expect(inEurope('ES')).toBeTruthy();
    expect(inEurope('nl')).toBeTruthy();
    expect(inEurope('Fr')).toBeTruthy();
  });

  test('returns false for non-EU countries.', () => {
    expect(inEurope(Country.US)).toBeFalsy();
    expect(inEurope(Country.CA)).toBeFalsy();
    expect(inEurope('JP')).toBeFalsy();
    expect(inEurope('GB')).toBeFalsy();
  });

  test('returns false for invalid country string.', () => {
    expect(inEurope('XX')).toBeFalsy();
    expect(inEurope('INVALID')).toBeFalsy();
  });
});
