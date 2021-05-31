import { toMongoType } from '../src';

describe('Utils', () => {
  test('string is not converted.', () => {
    expect(toMongoType('hello')).toBe('hello');
  });

  test('array is not converted.', () => {
    expect(toMongoType(['hello'])).toMatchObject(['hello']);
  });

  test('date is converted.', () => {
    expect(toMongoType('2020-11-02T23:00:00.000Z')).toBeInstanceOf(Date);
  });
});
