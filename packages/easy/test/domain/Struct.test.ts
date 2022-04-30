import { Struct, required, isStruct } from '../../src';
import '@thisisagile/easy-test';
import { Dev } from '../ref';

describe('Struct', () => {
  class Address extends Struct {
    readonly street = this.state.street;
    @required() readonly city = this.state.city;
  }

  test('isValid passes', () => {
    expect(new Address({ city: 'Amsterdam' })).toBeValid();
  });

  test('isValid fails', () => {
    expect(new Address()).not.toBeValid();
  });

  test('update', () => {
    expect(new Address().update({})).toBeInstanceOf(Address);
  });

  test('toString', () => {
    expect(new Address()).toMatchText('Address');
  });

  test('toJson', () => {
    expect(new Address({ city: 'Amsterdam' }).toJSON()).toStrictEqual({ city: 'Amsterdam' });
  });

  test('isStruct', () => {
    expect(isStruct()).toBeFalsy();
    expect(isStruct({})).toBeFalsy();
    expect(isStruct(Dev.Rob)).toBeTruthy();
  })
});
