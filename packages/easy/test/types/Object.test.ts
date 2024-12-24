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

  test('extractKeys simple', () => {
    const [p, a] = extractKeys({ id: 42, name: 'Sander' }, ['id']);
    expect(p).toEqual({ id: 42 });
    expect(a).toEqual({ name: 'Sander' });
  });

  test('extractKeys empty', () => {
    const [p, a] = extractKeys(target, []);
    expect(p).toEqual({});
    expect(a).toEqual(target);
  });

  test('extractKeys single', () => {
    const [p, a] = extractKeys(target, ['name']);
    expect(p).toEqual({ name: target.name });
    expect(a).toEqual({ ...target, name: undefined });
  });

  test('extractKeys multiple', () => {
    const [person, address] = extractKeys(target, ['name', 'address']);
    expect(person).toEqual({ name: target.name, address: target.address });
    expect(address).toEqual({ ...target, name: undefined, address: undefined });
  });

  type Person = { id: number; accountId?: string };

  test('extractKeys multiple where some are undefined but with valid value', () => {
    const p = { id: 42 } as Person;
    const [person, rest] = extractKeys(p, ['id']);
    expect(person).toEqual({ id: 42 });
    expect((person as any).accountId).toBeUndefined();
    expect(rest).toEqual({});
  });

  test('extractKeys multiple where some are undefined, and should not be in the new object', () => {
    const p = { id: 42 } as Person;
    const [person, rest] = extractKeys(p, ['accountId']);
    expect(person).toEqual({});
    expect(rest).toEqual({ id: 42 });
    expect((rest as any).accountId).toBeUndefined();
  });

  test('extractKeys multiple from const', () => {
    const keys = ['name', 'address'] as const;
    const [person, address] = extractKeys(target, keys);
    expect(person).toEqual({ name: target.name, address: target.address });
    expect(address).toEqual({ ...target, name: undefined, address: undefined });
    expect((address as any).name).toBeUndefined();
    expect(Object.keys(address).join(',')).toBe('id,full');
  });
});
