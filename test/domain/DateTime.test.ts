import { DateTime } from '../../src';

describe('DateTime', () => {

  test('from value return correct DateTime', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1614589200000);
    expect(new DateTime().toJSON()).toBe('2021-03-01T09:00:00.000Z');
    expect(new DateTime(1616661584000).toJSON()).toBe('2021-03-25T08:39:44.000Z');
    expect(new DateTime('2021-03-25T08:39:44.000Z').toJSON()).toBe('2021-03-25T08:39:44.000Z');
    expect(new DateTime(new Date(1616661584000)).toJSON()).toBe('2021-03-25T08:39:44.000Z');
  });

  test('now return correct DateTime', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1614589200000);
    expect(DateTime.now.toJSON()).toBe('2021-03-01T09:00:00.000Z');
  });

});