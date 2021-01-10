import { convert } from '../../src';

describe('convert', () => {
  test('bool works', () => {
    expect(convert.toBool.fromNumber.from(true)).toBe(1);
    expect(convert.toBool.fromNumber.from(false)).toBe(0);
    expect(convert.toBool.fromNumber.to(1)).toBe(true);
    expect(convert.toBool.fromNumber.to(0)).toBe(false);
  });

  test('date works', () => {
    const date = '2020-07-01T10:00:00+02:00';
    const isoDate = '2020-07-01T08:00:00.000Z';
    expect(convert.toDate.fromString.from(date)).toBe(isoDate);
    expect(convert.toDate.fromString.to(isoDate)).toBe(isoDate);
  });

  test('number works', () => {
    expect(convert.toNumber.fromString.from(1)).toBe('1');
    expect(convert.toNumber.fromString.to('1')).toBe(1);
  });
});
