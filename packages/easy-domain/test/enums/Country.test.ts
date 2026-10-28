import '@thisisagile/easy-test';
import { toList } from '@thisisagile/easy';
import Country from '../../src/entries/Country';

describe('Country', () => {
  test('id and name matches.', () => {
    expect(Country.NL).toBeInstanceOf(Country.Enum);
    expect(Country.NL.id).toBe('NL');
    expect(Country.NL.name).toMatchText('Netherlands');
  });

  test('creates custom countries through the catalogue API.', () => {
    const country: Country.Enum = Country.create('Test Country', 'TC');

    expect(country).toBeInstanceOf(Country.Enum);
    expect(country.id).toBe('TC');
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
    expect(Country.byIds(['NL'])).toMatchText(toList<Country.Enum>(Country.NL));
  });

  test('equals.', () => {
    expect(Country.NL.equals(Country.NL)).toBeTruthy();
    expect(Country.NL.equals('nl')).toBeTruthy();
    expect(Country.NL.equals('NL')).toBeTruthy();
    expect(Country.NL.equals('BE')).toBeFalsy();
  });

  test('returns true for EU countries.', () => {
    expect(Country.inEurope(Country.NL)).toBeTruthy();
    expect(Country.inEurope(Country.DE)).toBeTruthy();
    expect(Country.inEurope('IT')).toBeTruthy();
    expect(Country.inEurope('ES')).toBeTruthy();
    expect(Country.inEurope('nl')).toBeTruthy();
    expect(Country.inEurope('Fr')).toBeTruthy();
  });

  test('returns false for non-EU countries.', () => {
    expect(Country.inEurope(Country.US)).toBeFalsy();
    expect(Country.inEurope(Country.CA)).toBeFalsy();
    expect(Country.inEurope('JP')).toBeFalsy();
    expect(Country.inEurope('GB')).toBeFalsy();
  });

  test('returns false for invalid country string.', () => {
    expect(Country.inEurope('XX')).toBeFalsy();
    expect(Country.inEurope('INVALID')).toBeFalsy();
  });
});
