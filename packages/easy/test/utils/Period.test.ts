import { DateTime, toStartEnd } from '../../src';

const ams = 'Europe/Amsterdam';
const date = 'yyyy-MM-dd';
const dateTime = 'yyyy-MM-dd HH:mm:ss';
const epoch = '1970-01-01';
const march1 = '2024-03-01';
const march31 = '2024-03-31';

describe('toStartEnd', () => {
  const now = DateTime.now;

  test('today', () => {
    const { start, end } = toStartEnd({ period: 'today' });
    expect(start.toFormat(dateTime)).toBe(now.startOf('day').toFormat(dateTime));
    expect(end.toFormat(dateTime)).toBe(now.endOf('day').toFormat(dateTime));
  });

  test('yesterday', () => {
    const { start, end } = toStartEnd({ period: 'yesterday' });
    expect(start.toFormat(date)).toBe(now.subtract(1, 'day').startOf('day').toFormat(date));
    expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
  });

  test('tomorrow', () => {
    const { start, end } = toStartEnd({ period: 'tomorrow' });
    expect(start.toFormat(date)).toBe(now.add(1, 'day').startOf('day').toFormat(date));
    expect(end.toFormat(date)).toBe(now.add(1, 'day').startOf('day').toFormat(date));
  });

  test('this-week', () => {
    const { start, end } = toStartEnd({ period: 'this-week' });
    expect(start.toFormat(date)).toBe(now.startOf('week').toFormat(date));
    expect(end.toFormat(date)).toBe(now.endOf('week').toFormat(date));
  });

  test('last-seven-days', () => {
    const { start, end } = toStartEnd({ period: 'last-seven-days' });
    expect(start.toFormat(date)).toBe(now.subtract(6, 'day').startOf('day').toFormat(date));
    expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
  });

  test('last-week', () => {
    const { start, end } = toStartEnd({ period: 'last-week' });
    expect(start.toFormat(date)).toBe(now.subtract(1, 'week').startOf('week').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(1, 'week').endOf('week').toFormat(date));
  });

  test('last-two-weeks (rolling 13 days)', () => {
    const { start, end } = toStartEnd({ period: 'last-two-weeks' });
    expect(start.toFormat(date)).toBe(now.subtract(13, 'day').startOf('day').toFormat(date));
    expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
  });

  test('next-week', () => {
    const { start, end } = toStartEnd({ period: 'next-week' });
    expect(start.toFormat(date)).toBe(now.add(1, 'week').startOf('week').toFormat(date));
    expect(end.toFormat(date)).toBe(now.add(1, 'week').endOf('week').toFormat(date));
  });

  test('this-month', () => {
    const { start, end } = toStartEnd({ period: 'this-month' });
    expect(start.toFormat(date)).toBe(now.startOf('month').toFormat(date));
    expect(end.toFormat(date)).toBe(now.endOf('month').toFormat(date));
  });

  test('last-month', () => {
    const { start, end } = toStartEnd({ period: 'last-month' });
    expect(start.toFormat(date)).toBe(now.subtract(1, 'month').startOf('month').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(1, 'month').endOf('month').toFormat(date));
  });

  test('two-months-ago', () => {
    const { start, end } = toStartEnd({ period: 'two-months-ago' });
    expect(start.toFormat(date)).toBe(now.subtract(2, 'month').startOf('month').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(2, 'month').endOf('month').toFormat(date));
  });

  test('three-months-ago', () => {
    const { start, end } = toStartEnd({ period: 'three-months-ago' });
    expect(start.toFormat(date)).toBe(now.subtract(3, 'month').startOf('month').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(3, 'month').endOf('month').toFormat(date));
  });

  test('last-three-months (rolling)', () => {
    const { start, end } = toStartEnd({ period: 'last-three-months' });
    expect(start.toFormat(date)).toBe(now.subtract(3, 'month').startOf('day').toFormat(date));
    expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
  });

  test('next-month', () => {
    const { start, end } = toStartEnd({ period: 'next-month' });
    expect(start.toFormat(date)).toBe(now.add(1, 'month').startOf('month').toFormat(date));
    expect(end.toFormat(date)).toBe(now.add(1, 'month').endOf('month').toFormat(date));
  });

  test('this-year', () => {
    const { start, end } = toStartEnd({ period: 'this-year' });
    expect(start.toFormat(date)).toBe(now.startOf('year').toFormat(date));
    expect(end.toFormat(date)).toBe(now.endOf('year').toFormat(date));
  });

  test('last-year', () => {
    const { start, end } = toStartEnd({ period: 'last-year' });
    expect(start.toFormat(date)).toBe(now.subtract(1, 'year').startOf('year').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(1, 'year').endOf('year').toFormat(date));
  });

  test('two-years-ago', () => {
    const { start, end } = toStartEnd({ period: 'two-years-ago' });
    expect(start.toFormat(date)).toBe(now.subtract(2, 'year').startOf('year').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(2, 'year').endOf('year').toFormat(date));
  });

  test('three-years-ago', () => {
    const { start, end } = toStartEnd({ period: 'three-years-ago' });
    expect(start.toFormat(date)).toBe(now.subtract(3, 'year').startOf('year').toFormat(date));
    expect(end.toFormat(date)).toBe(now.subtract(3, 'year').endOf('year').toFormat(date));
  });

  test('next-year', () => {
    const { start, end } = toStartEnd({ period: 'next-year' });
    expect(start.toFormat(date)).toBe(now.add(1, 'year').startOf('year').toFormat(date));
    expect(end.toFormat(date)).toBe(now.add(1, 'year').endOf('year').toFormat(date));
  });

  test('all-time starts at unix epoch', () => {
    const { start, end } = toStartEnd({ period: 'all-time' });
    expect(start.toFormat(date)).toBe(epoch);
    expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
  });

  describe('else: explicit start/end', () => {
    const s = new DateTime(march1);
    const e = new DateTime(march31);

    test('both provided', () => {
      const { start, end } = toStartEnd({ start: s, end: e });
      expect(start.toFormat(date)).toBe(march1);
      expect(end.toFormat(date)).toBe(march31);
    });

    test('only start provided', () => {
      const { start, end } = toStartEnd({ start: s });
      expect(start.toFormat(date)).toBe(march1);
      expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
    });

    test('only end provided', () => {
      const { start, end } = toStartEnd({ end: e });
      expect(start.toFormat(date)).toBe(now.startOf('day').toFormat(date));
      expect(end.toFormat(date)).toBe(march31);
    });

    test('neither provided defaults to today', () => {
      const { start, end } = toStartEnd({});
      expect(start.toFormat(date)).toBe(now.startOf('day').toFormat(date));
      expect(end.toFormat(date)).toBe(now.startOf('day').toFormat(date));
    });
  });

  describe('timezone', () => {
    test('zone shifts period boundaries', () => {
      const utc = toStartEnd({ period: 'today' });
      const amsterdam = toStartEnd({ period: 'today', zone: ams });
      // UTC midnight and Amsterdam midnight are different instants in time
      expect(utc.start.toEpoch()).not.toBe(amsterdam.start.toEpoch());
    });

    test('all-time start is epoch in specified zone', () => {
      const { start } = toStartEnd({ period: 'all-time', zone: ams });
      expect(start.toFormat(date)).toBe('1970-01-01');
    });
  });
});
