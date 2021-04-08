import { Collection, Field } from '../../src';
import '@thisisagile/easy-test';

class developers extends Collection {}

describe('Field', () => {
  const field = new Field(new developers(), 'name');

  test('new field', () => {
    expect(field.name).toBe('name');
  });
});
