import { DateTime, DateTimeUnit } from '../../../src';
import '@thisisagile/easy-test';
import moment from 'moment';
import { mock } from '@thisisagile/easy-test';

const iso = '2021-03-25T08:39:44.000Z';

const date = {
  iso: '2021-03-25T08:39:44.000Z',
  epoch: 1616661584000,
  ams: '2021-03-25T09:39:44+01:00',
};
const formats = {
  ddmmyyyy: 'DD/MM/YYYY',
  yyyymmdd: 'YYYY-DD-MM',
  yyyyddmm: 'YYYY-MM-DD',
  yyyymmddthhmm: 'YYYY-MM-DD[T]hh:mm',
  yyyymmddhhmmss: 'YYYY-MM-DD hh:mm:ss',
  ddmmyyyyhhmmss: 'DD/MM/YYYY hh:mm:ss',
  yyyymmddthhmmss: 'YYYY-MM-DD[T]hh:mm:ss',
  yyyymmddthhmmsssssz: 'YYYY-MM-DD[T]hh:mm:ss.SSSZ',
};

describe('DateTime', () => {
  test('moment decided to mark undefined as a valid date.', () => {
    const res = moment(undefined, true);
    expect(res).toBeTruthy();
  });

  test('construct from undefined is not valid and value is undefined.', () => {
    const res = new DateTime(undefined as unknown as string);
    expect(res.value).toBeUndefined();
    expect(res).not.toBeValid();
  });

  test('construct from empty string is not valid.', () => {
    const res = new DateTime('');
    expect(res).not.toBeValid();
  });

  test('construct from invalid string is not valid.', () => {
    expect(new DateTime('2021-5-5')).not.toBeValid();
    expect(new DateTime('invalid')).not.toBeValid();
  });

  test('construct from epoch 0 is valid.', () => {
    const res = new DateTime(0);
    expect(res).toBeValid();
  });

  test('construct from Date.now is valid.', () => {
    const res = new DateTime(Date.now());
    expect(res).toBeValid();
  });

  test('construct from date string', () => {
    expect(new DateTime('2021-11-11')).toMatchText('2021-11-11T00:00:00.000Z');
    expect(new DateTime('2021-11-11T01:00')).toMatchText('2021-11-11T01:00:00.000Z');
    expect(new DateTime('2021-11-11T01:23:11')).toMatchText('2021-11-11T01:23:11.000Z');
    expect(new DateTime('2021-11-11T01:00:00.000+0100')).toMatchText('2021-11-11T00:00:00.000Z');
  });

  test('construct from iso date is valid.', () => {
    const res = new DateTime(date.iso);
    expect(res).toBeValid();
  });

  test('construct from epoch is valid.', () => {
    expect(new DateTime(date.epoch)).toBeValid();
  });

  test('construct from Date is valid.', () => {
    expect(new DateTime(new Date(date.epoch))).toBeValid();
  });

  test.each([
    ['2021-11-10', formats.yyyymmdd, '2021-10-11T00:00:00.000Z'],
    ['2021-10-11', formats.yyyyddmm, '2021-10-11T00:00:00.000Z'],
    ['2021-10-11T01:23', formats.yyyymmddthhmm, '2021-10-11T01:23:00.000Z'],
    ['2021-10-11T01:23:11', formats.yyyymmddthhmmss, '2021-10-11T01:23:11.000Z'],
    ['2021-10-11T01:23:59.123+0100', formats.yyyymmddthhmmsssssz, '2021-10-11T00:23:59.123Z'],
    ['23/11/2021 09:15:00', formats.ddmmyyyyhhmmss, '2021-11-23T09:15:00.000Z'],
    ['Wed Dec 24 09:15:00 -0800 2014', 'ddd MMM DD hh:mm:ss ZZ YYYY', '2014-12-24T17:15:00.000Z'],
  ])('construct with date: %s and format: %s should return %s', (s, f, e) => {
    const res = new DateTime(s, f);
    expect(res).toBeValid();
    expect(res).toMatchText(new DateTime(e));
  });

  test.each([
    [date.iso, 'foo'],
    ['bar', formats.ddmmyyyy],
    ['01/23/2021', formats.ddmmyyyy],
  ])('construct with date: %s and format: %s should be invalid', (s, f) => {
    const res = new DateTime(s, f);
    expect(res).not.toBeValid();
  });

  test.each([
    [['year', 'years', 'y'], '2021-01-01T00:00:00.000Z'],
    [['month', 'months', 'M'], '2021-10-01T00:00:00.000Z'],
    [['week', 'weeks', 'w'], '2021-10-10T00:00:00.000Z'],
    [['day', 'days', 'd'], '2021-10-16T00:00:00.000Z'],
    [['hour', 'hours', 'h'], '2021-10-16T01:00:00.000Z'],
    [['minute', 'minutes', 'm'], '2021-10-16T01:23:00.000Z'],
    [['second', 'seconds', 's'], '2021-10-16T01:23:58.000Z'],
  ])('startOf with unit: %s should return %s', (us, e) => {
    const res = new DateTime('2021-10-16T01:23:58.123Z');
    us.forEach(ut => expect(res.startOf(ut as DateTimeUnit)).toMatchText(new DateTime(e)));
  });

  test.each([
    [['year', 'years', 'y'], '2021-12-31T23:59:59.999Z'],
    [['month', 'months', 'M'], '2021-10-31T23:59:59.999Z'],
    [['week', 'weeks', 'w'], '2021-10-16T23:59:59.999Z'],
    [['day', 'days', 'd'], '2021-10-15T23:59:59.999Z'],
    [['hour', 'hours', 'h'], '2021-10-15T01:59:59.999Z'],
    [['minute', 'minutes', 'm'], '2021-10-15T01:23:59.999Z'],
    [['second', 'seconds', 's'], '2021-10-15T01:23:58.999Z'],
  ])('endOf with unit: %s should return %s', (us, e) => {
    const res = new DateTime('2021-10-15T01:23:58.123Z');
    us.forEach(ut => expect(res.endOf(ut as DateTimeUnit)).toMatchText(new DateTime(e)));
  });

  test.each([
    [date.iso, 'foo'],
    ['bar', formats.ddmmyyyy],
    ['01/23/2021', formats.ddmmyyyy],
  ])('construct with date: %s and format: %s should be invalid', (s, f) => {
    const res = new DateTime(s, f);
    expect(res).not.toBeValid();
  });

  test('construct fails when date or format are invalid.', () => {
    const res = new DateTime('2021-11-10', 'foo');
    expect(res).not.toBeValid();
  });

  test('toString from undefined returns empty string.', () => {
    const res = new DateTime(undefined as unknown as string);
    expect(res).toMatchText('');
  });

  test('toString returns iso formatted string.', () => {
    const res = new DateTime(date.iso);
    expect(res).toMatchText(date.iso);
  });

  test('toDate returns Date.', () => {
    const res = new DateTime(date.iso);
    expect(res.toDate()).toStrictEqual(new Date(date.iso));
  });

  test('toDate of invalid DateTime returns undefined.', () => {
    const res = new DateTime('Hello World');
    expect(res.toDate()).toBeUndefined();
  });

  test('toString from epoch date returns a iso string.', () => {
    Date.now = mock.return(date.epoch);
    const res = new DateTime(Date.now());
    expect(res).toMatchText(date.iso);
  });

  test('now returns iso string.', () => {
    Date.now = mock.return(date.epoch);
    expect(DateTime.now).toMatchText(date.iso);
  });

  test('from value return correct DateTime', () => {
    expect(new DateTime(date.iso).toJSON()).toMatchText(date.iso);
    expect(new DateTime(new Date(date.epoch)).toJSON()).toMatchText(date.iso);
  });

  test('add', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(5);
    expect(d).toMatchText('2021-03-30T08:39:44.000Z');
  });

  test('add other unit', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(5, 'years');
    expect(d).toMatchText('2026-03-25T08:39:44.000Z');
  });

  test('add negative', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(-5);
    expect(d).toMatchText('2021-03-20T08:39:44.000Z');
  });

  test('subtract', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).subtract(5);
    expect(d).toMatchText('2021-03-20T08:39:44.000Z');
  });

  test('subtract other unit', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).subtract(5, 'years');
    expect(d).toMatchText('2016-03-25T08:39:44.000Z');
  });

  test('subtract again, to check immutability', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso);
    const d2 = d.subtract(5);
    expect(d).not.toMatchText(d2);
  });

  test('diff', () => {
    const d = new DateTime(iso);
    const d2 = d.add(5);
    expect(d2.diff(d)).toBe(5);
  });

  test('diff other unit', () => {
    const d = new DateTime(iso);
    const d2 = d.add(6, 'months');
    expect(d2.diff(d, 'weeks')).toBe(26);
  });

  test('from now from iso string.', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso);
    expect(d.fromNow).toMatchText('a few seconds ago');
  });

  test('isAfter', () => {
    const current = DateTime.now;
    const next = current.add(2);
    expect(next.isAfter(current)).toBeTruthy();
    expect(current.isAfter(next)).toBeFalsy();
  });

  test('isBefore', () => {
    const current = DateTime.now;
    const next = current.add(2);
    expect(next.isBefore(current)).toBeFalsy();
    expect(current.isBefore(next)).toBeTruthy();
  });

  test('equals', () => {
    const current = DateTime.now;
    const next = current.add(2);
    const prev = current.subtract(2);

    expect(current.equals(current)).toBeTruthy();

    expect(current.equals(next)).toBeFalsy();
    expect(next.equals(current)).toBeFalsy();

    expect(current.equals(prev)).toBeFalsy();
    expect(prev.equals(current)).toBeFalsy();
  });

  test('toLocale', () => {
    const dt = new DateTime(iso);
    expect(dt.toLocale()).toMatchText('25-3-2021');
    expect(dt.toLocale('de-DE')).toMatchText('25.3.2021');
    expect(dt.toLocale('de-DE', { dateStyle: 'full' })).toMatchText('Donnerstag, 25. März 2021');
  });

  test('toFull', () => {
    const dt = new DateTime(iso);
    expect(dt.toFull('nl-NL')).toMatchText('25 maart 2021');
    expect(dt.toFull('de-DE')).toMatchText('25. März 2021');
    expect(dt.toFull('de-DE')).toMatchText('25. März 2021');
  });
});
