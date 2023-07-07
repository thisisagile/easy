import { toMongoType } from '../src';
import { DateTime } from '@thisisagile/easy';

describe('Utils', () => {
  test('string is not converted.', () => {
    expect(toMongoType('hello')).toBe('hello');
  });

  test('array is not converted.', () => {
    expect(toMongoType(['hello'])).toMatchObject(['hello']);
  });

  test('isoDate is converted.', () => {
    expect(toMongoType('2021-11-02T23:00:00.000Z')).toBeInstanceOf(Date);
  });

  test('toMongoType is idempotent', () => {
    expect(toMongoType(toMongoType('2022-11-02T23:00:00.000Z'))).toBeInstanceOf(Date);
  });

  test('DateTime is converted', () => {
    expect(toMongoType(new DateTime('2020-11-02T23:00:00.000Z'))).toBeInstanceOf(Date);
  });
});
