import { Field, SortCondition } from '../../src';
import '@thisisagile/easy-test';

describe('Field', () => {
  const field = new Field('name');

  test('new field', () => {
    expect(field.property).toBe('name');
  });

  test('asc field', () => {
    expect(field.asc()).toBeInstanceOf(SortCondition);
    expect(field.asc().toJSON()).toStrictEqual({ name: -1 });
  });

  test('desc field', () => {
    expect(field.desc()).toBeInstanceOf(SortCondition);
    expect(field.desc().toJSON()).toStrictEqual({ name: 1 });
  });
});
