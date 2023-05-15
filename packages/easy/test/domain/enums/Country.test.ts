import '@thisisagile/easy-test';
import { toList } from '@thisisagile/easy';
import { Country } from '../../../src';

describe('Country', () => {
  test('id and name matches.', () => {
    expect(Country.NL.id).toBe('NL');
    expect(Country.NL.name).toMatchText('Netherlands');
  });

  test('short matches.', () => {
    expect(Country.NL).toMatchText('NL');
  });

  test('byId is not case sensitive and accepts both dashes as well as underscores.', () => {
    expect(Country.byId('nl')).toBe(Country.NL);
    expect(Country.byId('NL')).toBe(Country.NL);
  });

  test('byId is fast.', ()=>{
    jest.spyOn(Country, 'first');
    expect(Country.byId('nl')).toBe(Country.NL);
    expect(Country.first).toHaveBeenCalledTimes(0);
    expect(Country.byId('xx')).toBeUndefined();
    expect(Country.first).toHaveBeenCalledTimes(1);
  });

  test('byIds.', () => {
    expect(Country.byIds<Country>(['nl'])).toMatchText(toList<Country>(Country.NL));
  });

  test('equals.', () => {
    expect(Country.NL.equals(Country.NL)).toBeTruthy();
    expect(Country.NL.equals('nl')).toBeTruthy();
    expect(Country.NL.equals('NL')).toBeTruthy();
    expect(Country.NL.equals('BE')).toBeFalsy();
  });
});
