import '@thisisagile/easy-test';
import { Address, isAddress } from '../../src';
import { json } from '@thisisagile/easy';

describe('Address', () => {
  const address = new Address({
    street: 'Kalverstraat',
    houseNumber: '1',
    postalCode: '1012 NX',
    city: 'Amsterdam',
    country: 'NL',
  });

  test('default', () => {
    const a = new Address();
    expect(a).not.toBeValid();
  });

  test('valid Address', () => {
    expect(address).toBeValid();
  });

  test('not a valid Address', () => {
    const a = new Address({ ...address, country: undefined });
    expect(a).not.toBeValid();
  });

  test('toString of empty address', () => {
    expect(new Address()).toMatchText('');
  });

  test('toString without extension', () => {
    expect(address).toMatchText('Kalverstraat 1, 1012NX Amsterdam Netherlands');
  });

  test('toString with extension', () => {
    const a = new Address({ ...address, extension: 'Zw' });
    expect(a).toMatchText('Kalverstraat 1 Zw, 1012NX Amsterdam Netherlands');
  });

  test('toString with extension adn without postalCode', () => {
    const a = new Address({ ...json.omit(address.toJSON(), 'postalCode'), extension: 'Zw' });
    expect(a).toMatchText('Kalverstraat 1 Zw, Amsterdam Netherlands');
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
