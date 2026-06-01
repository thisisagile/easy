import { choose } from '../types/Case';
import { DateTime } from '../domain/DateTime';
import { Period } from '../types/Period';
import { utc } from '../types/Timezone';

export type StartEnd = { start: DateTime; end: DateTime };

export type StartEndOptions = {
  period?: Period;
  start?: DateTime;
  end?: DateTime;
  zone?: string;
};
export const toStartEnd = ({ period, start, end, zone = utc }: StartEndOptions): StartEnd => {
  const today = DateTime.now.withZone(zone).startOf('day');
  return choose(period)
    .equals('today', { start: today, end: today.endOf('day') })
    .equals('yesterday', { start: today.subtract(1, 'day'), end: today })
    .equals('tomorrow', { start: today.add(1, 'day'), end: today.add(1, 'day').endOf('day') })
    .equals('this-week', { start: today.startOf('week'), end: today.endOf('week') })
    .equals('last-seven-days', { start: today.subtract(6, 'day'), end: today.endOf('day') })
    .equals('last-week', {
      start: today.subtract(1, 'week').startOf('week'),
      end: today.subtract(1, 'week').endOf('week'),
    })
    .equals('last-two-weeks', { start: today.subtract(13, 'day'), end: today.endOf('day') })
    .equals('last-month', {
      start: today.subtract(1, 'month').startOf('month'),
      end: today.subtract(1, 'month').endOf('month'),
    })
    .equals('next-week', { start: today.add(1, 'week').startOf('week'), end: today.add(1, 'week').endOf('week') })
    .equals('this-month', { start: today.startOf('month'), end: today.endOf('month') })
    .equals('three-months-ago', {
      start: today.subtract(3, 'month').startOf('month'),
      end: today.subtract(3, 'month').endOf('month'),
    })
    .equals('two-months-ago', {
      start: today.subtract(2, 'month').startOf('month'),
      end: today.subtract(2, 'month').endOf('month'),
    })
    .equals('last-three-months', { start: today.subtract(3, 'month'), end: today.endOf('day') })
    .equals('next-month', { start: today.add(1, 'month').startOf('month'), end: today.add(1, 'month').endOf('month') })
    .equals('this-year', { start: today.startOf('year'), end: today.endOf('year') })
    .equals('last-year', {
      start: today.subtract(1, 'year').startOf('year'),
      end: today.subtract(1, 'year').endOf('year'),
    })
    .equals('two-years-ago', {
      start: today.subtract(2, 'year').startOf('year'),
      end: today.subtract(2, 'year').endOf('year'),
    })
    .equals('three-years-ago', {
      start: today.subtract(3, 'year').startOf('year'),
      end: today.subtract(3, 'year').endOf('year'),
    })
    .equals('next-year', { start: today.add(1, 'year').startOf('year'), end: today.add(1, 'year').endOf('year') })
    .equals('all-time', { start: new DateTime(0).withZone(zone), end: today.endOf('day') })
    .else({ start: start ?? today, end: end ?? today.endOf('day') });
};
