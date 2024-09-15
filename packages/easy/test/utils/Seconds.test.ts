import { dt, seconds } from '../../src';
import { DateTime } from 'luxon';
import { mock } from '@thisisagile/easy-test';

describe('Seconds', () => {
  test('split', () => {
    expect(seconds.toDuration(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(seconds.toDuration(1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
    expect(seconds.toDuration(60)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0 });
    expect(seconds.toDuration(3600)).toEqual({ days: 0, hours: 1, minutes: 0, seconds: 0 });
    expect(seconds.toDuration(86400)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
    expect(seconds.toDuration(86401)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 1 });
    expect(seconds.toDuration(86461)).toEqual({ days: 1, hours: 0, minutes: 1, seconds: 1 });
    expect(seconds.toDuration(90061)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  test('toText', () => {
    expect(seconds.toText(0)).toBe('0s');
    expect(seconds.toText(1)).toBe('1s');
    expect(seconds.toText(60)).toBe('1m');
    expect(seconds.toText(3600)).toBe('1h');
    expect(seconds.toText(86400)).toBe('1d');
    expect(seconds.toText(86401)).toBe('1d');
    expect(seconds.toText(86461)).toBe('1d 1m');
    expect(seconds.toText(90061)).toBe('1d 1h 1m');
  });

  test('ago', () => {
    const start = dt('2021-01-01T00:00:00Z');
    const end = dt('2021-01-01T00:00:01Z');
    expect(seconds.ago(start, end)).toBe('1s');
  });

  test('ago with default end', () => {
    DateTime.now = mock.return(dt('2021-01-03T03:03:01Z'));
    const start = dt('2021-01-06T00:00:00Z');
    expect(seconds.ago(start)).toBe('1348d 13h 13m');
  });
});
