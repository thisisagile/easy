import { entries, extractKeys, keys, values } from '../../src';

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

  test('separate simple', () => {
    const [p, a] = extractKeys({ id: 42, name: 'Sander' }, ['id']);
    expect(p).toEqual({ id: 42 });
    expect(a).toEqual({ name: 'Sander' });
  });

  test('separate empty', () => {
    const [p, a] = extractKeys(target, []);
    expect(p).toEqual({});
    expect(a).toEqual(target);
  });

  test('separate single', () => {
    const [p, a] = extractKeys(target, ['name']);
    expect(p).toEqual({ name: target.name });
    expect(a).toEqual({ ...target, name: undefined });
  });

  test('separate multiple', () => {
    const [person, address] = extractKeys(target, ['name', 'address']);
    expect(person).toEqual({ name: target.name, address: target.address });
    expect(address).toEqual({ ...target, name: undefined, address: undefined });
  });
});
