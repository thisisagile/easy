import { entries, keys, values } from '../../src';

const target = {
  id: 42,
  name: {
    first: 'John',
    middle: 'F',
    last: 'Doe',
  },
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    country: {
      name: 'USA',
      code: 'US',
    },
  },

  full: () => `John F. Doe`,
};

class Person {}

describe('Object', () => {
  test('entries', () => {
    expect(entries({})).toHaveLength(0);
    expect(entries(target)).toHaveLength(4);
    expect(entries(target)).toContainEqual(['id', 42]);
    expect(entries(target)).toContainEqual(['name', { first: 'John', middle: 'F', last: 'Doe' }]);
  });

  test('values', () => {
    expect(values({})).toHaveLength(0);
    expect(values(target)).toHaveLength(4);
    expect(values(target)).toContain(42);
  });

  test('keys', () => {
    expect(keys({})).toHaveLength(0);
    expect(keys(target)).toHaveLength(4);
    expect(keys(target)).toContain('id');
    expect(keys(target)).toContain('name');
  });
});
