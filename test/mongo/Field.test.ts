import { Field } from '../../src';
import '@thisisagile/easy-test';

describe('Field', () => {
  const field = new Field('name');

  test('new field', () => {
    expect(field.property).toBe('name');
  });
});
