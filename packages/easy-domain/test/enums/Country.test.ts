import '@thisisagile/easy-test';
import { toList } from '@thisisagile/easy';
import { Country } from '../../src';

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
});
