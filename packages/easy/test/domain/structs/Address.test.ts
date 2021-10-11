import '@thisisagile/easy-test';
import { Address, isAddress } from '../../../src';

describe('Address', () => {
  const address = new Address({ street: 'Kalverstraat', houseNumber: '1', postalCode: '1012 NX', city: 'Amsterdam', country: 'Netherlands' });

  test('default', () => {
    const a = new Address();
    expect(a).not.toBeValid();
  });

  test('valid Address', () => {
    expect(address).toBeValid();
  });

  test('toString', () => {
    expect(address).toMatchText('Kalverstraat 1, 1012 NX Amsterdam Netherlands');
  });
});

describe('isAddress', () => {
  test('false', () => {
    expect(isAddress()).toBeFalsy();
    expect(isAddress({})).toBeFalsy();
    expect(isAddress('Amsterdam')).toBeFalsy();
    expect(isAddress(42)).toBeFalsy();
  });
  test('true', () => {
    expect(isAddress(new Address())).toBeTruthy();
  });
});
