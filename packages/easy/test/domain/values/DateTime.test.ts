import { DateTime } from '../../../src';

describe('DateTime', () => {
  const testDate = {
    iso: '2021-03-25T08:39:44.000Z',
    epoch: 1616661584000,
  };

  test('from value return correct DateTime', () => {
    expect(new DateTime(testDate.epoch).toJSON()).toBe(testDate.iso);
    expect(new DateTime(testDate.iso).toJSON()).toBe(testDate.iso);
    expect(new DateTime(new Date(testDate.epoch)).toJSON()).toBe(testDate.iso);
  });

  test('from undefined return empty DateTime', () => {
    expect(new DateTime(undefined as unknown as string).toJSON()).toBe('');
    expect(new DateTime(null as unknown as string).toJSON()).toBe('');
  });

  test('valid', () => {
    expect(new DateTime(testDate.epoch).isValid).toBeTruthy();
    expect(new DateTime(testDate.iso).isValid).toBeTruthy();
    expect(new DateTime(new Date(testDate.epoch)).isValid).toBeTruthy();
    expect(new DateTime("hello").isValid).toBeFalsy();
    expect(new DateTime(undefined as unknown as string).isValid).toBeFalsy();
    expect(new DateTime(null as unknown as string).isValid).toBeFalsy();
  });

  test('now return correct DateTime', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => testDate.epoch);
    expect(DateTime.now.toJSON()).toBe(testDate.iso);
  });

  test('fromNow return correct', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => testDate.epoch);
    expect(DateTime.now.fromNow).toBe('a few seconds ago');
  });
});
