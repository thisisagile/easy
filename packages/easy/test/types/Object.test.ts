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
    const { keys, ...rest } = extractKeys({ id: 42, name: 'Sander' }, ['id']);
    expect(keys).toEqual({ id: 42 });
    expect(rest).toEqual({ name: 'Sander' });
  });

  test('extractKeys empty', () => {
    const { keys, ...rest } = extractKeys(target, []);
    expect(keys).toEqual({});
    expect(rest).toEqual(target);
  });

  test('extractKeys single', () => {
    const { keys, ...rest } = extractKeys(target, ['name']);
    expect(keys).toEqual({ name: target.name });
    expect(rest).toEqual({ ...target, name: undefined });
  });

  test('extractKeys multiple', () => {
    const { keys, ...rest } = extractKeys(target, ['name', 'address']);
    expect(keys).toEqual({ name: target.name, address: target.address });
    expect(rest).toEqual({ ...target, name: undefined, address: undefined });
  });

  type Person = { id: number; accountId?: string };

  test('extractKeys multiple where some are undefined but with valid value', () => {
    const p = { id: 42 } as Person;
    const { keys, ...rest } = extractKeys(p, ['id']);
    expect(keys).toEqual({ id: 42 });
    expect((keys as any).accountId).toBeUndefined();
    expect(rest).toEqual({});
  });

  test('extractKeys multiple where some are undefined, and should not be in the new object', () => {
    const p = { id: 42 } as Person;
    const { keys, ...rest } = extractKeys(p, ['accountId']);
    expect(keys).toEqual({});
    expect(rest).toEqual({ id: 42 });
    expect((rest as any).accountId).toBeUndefined();
  });

  test('extractKeys multiple from const', () => {
    const ks = ['name', 'address'] as const;
    const { keys, ...rest } = extractKeys(target, ks);
    expect(keys).toEqual({ name: target.name, address: target.address });
    expect(rest).toEqual({ ...target, name: undefined, address: undefined });
    expect((rest as any).name).toBeUndefined();
    expect(Object.keys(rest).join(',')).toBe('id,full');
  });
});
