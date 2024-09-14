import { seconds } from '../../src';

describe('Seconds', () => {
  const { toDuration, toText } = seconds;

  test('split', () => {
    expect(toDuration(0)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    expect(toDuration(1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
    expect(toDuration(60)).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 0 });
    expect(toDuration(3600)).toEqual({ days: 0, hours: 1, minutes: 0, seconds: 0 });
    expect(toDuration(86400)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 0 });
    expect(toDuration(86401)).toEqual({ days: 1, hours: 0, minutes: 0, seconds: 1 });
    expect(toDuration(86461)).toEqual({ days: 1, hours: 0, minutes: 1, seconds: 1 });
    expect(toDuration(90061)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
  });

  test('toText', () => {
    expect(toText(0)).toBe('0s');
    expect(toText(1)).toBe('1s');
    expect(toText(60)).toBe('1m');
    expect(toText(3600)).toBe('1h');
    expect(toText(86400)).toBe('1d');
    expect(toText(86401)).toBe('1d');
    expect(toText(86461)).toBe('1d 1m');
    expect(toText(90061)).toBe('1d 1h 1m');
  });
});
