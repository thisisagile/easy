import { DateTime } from '../../../src';

describe('DateTime', () => {
  const testDate = {
    iso: '2021-03-25T08:39:44.000Z',
    epoch: 1616661584000,
  };

  test('from value return correct DateTime', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1614589200000);
    expect(new DateTime(testDate.epoch).toJSON()).toBe(testDate.iso);
    expect(new DateTime(testDate.iso).toJSON()).toBe(testDate.iso);
    expect(new DateTime(new Date(testDate.epoch)).toJSON()).toBe(testDate.iso);
  });

  test('now return correct DateTime', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => testDate.epoch);
    expect(new DateTime().toJSON()).toBe(testDate.iso);
    expect(DateTime.now.toJSON()).toBe(testDate.iso);
  });

  test('now return correct DateTime 2', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => testDate.epoch);
    expect(DateTime.now.fromNow).toBe('a few seconds ago');
  });
});
