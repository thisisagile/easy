import { DateTime } from '../../src';

describe('DateTime', () => {

  test('from value return correct DateTime', () => {
    expect(new DateTime().toJSON()).toBe('2021-03-01T09:00:00.000Z');
    expect(new DateTime(1616661584000).toJSON()).toBe('2021-03-25T08:39:44.000Z');
    expect(new DateTime('2021-03-25T08:39:44.000Z').toJSON()).toBe('2021-03-25T08:39:44.000Z');
    expect(new DateTime(new Date(1616661584000)).toJSON()).toBe('2021-03-25T08:39:44.000Z');
  });

});