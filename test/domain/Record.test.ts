import { Record, required } from '../../src';
import '@thisisagile/easy-test';

describe('Record', () => {
  class Address extends Record {
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
    expect(new Address().toString()).toBe('Address');
  });
});
