import { DateTime, DateTimeUnit, dt, isDateTime } from '../../../src';
import '@thisisagile/easy-test';
import { mock } from '@thisisagile/easy-test';

const iso = '2021-03-25T08:39:44.000Z';
const new_york = '2021-03-25T04:39:44.000-04:00';

const date = {
  iso: '2021-03-25T08:39:44.000Z',
  epoch: 1616661584000,
  ams: '2021-03-25T09:39:44+01:00',
};
const formats = {
  ddmmyyyy: 'dd/MM/yyyy',
  yyyymmdd: 'yyyy-dd-MM',
  yyyyddmm: 'yyyy-MM-dd',
  yyyymmddthhmm: "yyyy-MM-dd'T'hh:mm",
  yyyymmddhhmmss: 'yyyy-MM-dd hh:mm:ss',
  ddmmyyyyhhmmss: 'dd/MM/yyyy hh:mm:ss',
  yyyymmddthhmmss: "yyyy-MM-dd'T'hh:mm:ss",
  yyyymmddthhmmssssszzz: "yyyy-MM-dd'T'hh:mm:ss.SSSZZZ",
};

describe('DateTime', () => {
  test('construct from undefined is not valid and value is undefined.', () => {
    const res = new DateTime(undefined as unknown as string);
    expect(res.value).toBeUndefined();
    expect(res).not.toBeValid();
  });

  test('from empty string is not valid.', () => {
    const res = new DateTime('');
    expect(res).not.toBeValid();
  });

  test('from invalid string is not valid.', () => {
    expect(new DateTime('2021-5-5')).not.toBeValid();
    expect(new DateTime('invalid')).not.toBeValid();
  });

  test('from epoch 0 is valid.', () => {
    const res = new DateTime(0);
    expect(res).toBeValid();
  });

  test('from Date.now is valid.', () => {
    const res = new DateTime(Date.now());
    expect(res).toBeValid();
  });

  test('from date string', () => {
    expect(new DateTime('2021-11-11')).toEqual('2021-11-11T00:00:00.000Z');
    expect(new DateTime('2021-11-11T01:00')).toMatchText('2021-11-11T01:00:00.000Z');
    expect(new DateTime('2021-11-11T01:23:11')).toMatchText('2021-11-11T01:23:11.000Z');
    expect(new DateTime('2021-11-11T01:00:00.000+0100').toJSON()).toMatchText('2021-11-11T00:00:00.000Z');
  });

  test('equality', () => {
    expect(new DateTime('2021-11-11')).toEqual(new DateTime('2021-11-11'));
    expect(new DateTime('2021-11-12T00:00:00.000Z')).toEqual(new DateTime('2021-11-12T00:00:00.000Z'));
    expect(new DateTime('2023-11-11T00:00:00.000Z')).not.toEqual(new DateTime('2023-11-11T00:00:00.001Z'));
    expect(new DateTime('2024-01-01T01:00:00.000+0100')).not.toEqual('2024-01-01T00:00:00.000Z');
  });

  test('from iso date is valid.', () => {
    const res = new DateTime(date.iso);
    expect(res).toBeValid();
  });

  test('from epoch is valid.', () => {
    expect(new DateTime(date.epoch)).toBeValid();
  });

  test('from Date is valid.', () => {
    expect(new DateTime(new Date(date.epoch))).toBeValid();
  });

  test.each([
    ['2021-11-10', formats.yyyymmdd, '2021-10-11T00:00:00.000Z'],
    ['2022-10-11', formats.yyyyddmm, '2022-10-11T00:00:00.000Z'],
    ['2021-10-11T01:23', formats.yyyymmddthhmm, '2021-10-11T01:23:00.000Z'],
    ['2021-10-11T01:23:11', formats.yyyymmddthhmmss, '2021-10-11T01:23:11.000Z'],
    ['2021-10-11T01:23:59.123+0100', formats.yyyymmddthhmmssssszzz, '2021-10-11T00:23:59.123Z'],
    ['23/11/2021 09:15:00', formats.ddmmyyyyhhmmss, '2021-11-23T09:15:00.000Z'],
    ['Wed Dec 24 09:15:00 -0800 2014', 'EEE MMM dd hh:mm:ss ZZZ yyyy', '2014-12-24T17:15:00.000Z'],
  ])('construct with date: %s and format: %s should return %s', (s, f, e) => {
    const res = new DateTime(s, f);
    expect(res).toBeValid();
    expect(res.toJSON()).toMatchText(new DateTime(e));
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
    ['year', '2021-01-01T00:00:00.000Z'],
    ['month', '2021-10-01T00:00:00.000Z'],
    ['week', '2021-10-11T00:00:00.000Z'],
    ['day', '2021-10-16T00:00:00.000Z'],
    ['hour', '2021-10-16T01:00:00.000Z'],
    ['minute', '2021-10-16T01:23:00.000Z'],
    ['second', '2021-10-16T01:23:58.000Z'],
  ])('startOf with unit: %s should return %s', (ut, e) => {
    const res = new DateTime('2021-10-16T01:23:58.123Z');
    expect(res.startOf(ut as DateTimeUnit).toJSON()).toMatchText(new DateTime(e));
  });

  test.each([
    ['year', '2020-12-31T22:00:00.000Z'],
    ['month', '2021-09-30T22:00:00.000Z'],
    ['week', '2021-10-10T22:00:00.000Z'],
    ['day', '2021-10-15T22:00:00.000Z'],
    ['hour', '2021-10-15T23:00:00.000Z'],
    ['minute', '2021-10-15T23:23:00.000Z'],
    ['second', '2021-10-15T23:23:58.000Z'],
  ])('zone aware startOf with unit: %s should return %s', (ut, e) => {
    const res = new DateTime('2021-10-16T01:23:58.123+02:00');
    expect(res.startOf(ut as DateTimeUnit).toJSON()).toMatchText(e);
  });

  test.each([
    ['year', '2021-12-31T23:59:59.999Z'],
    ['month', '2021-10-31T23:59:59.999Z'],
    ['week', '2021-10-17T23:59:59.999Z'],
    ['day', '2021-10-15T23:59:59.999Z'],
    ['hour', '2021-10-15T01:59:59.999Z'],
    ['minute', '2021-10-15T01:23:59.999Z'],
    ['second', '2021-10-15T01:23:58.999Z'],
  ])('endOf with unit: %s should return %s', (ut, e) => {
    const res = new DateTime('2021-10-15T01:23:58.123Z');
    expect(res.endOf(ut as DateTimeUnit).toJSON()).toMatchText(new DateTime(e));
  });

  test.each([
    ['year', '2021-12-31T21:59:59.999Z'],
    ['month', '2021-10-31T21:59:59.999Z'],
    ['week', '2021-10-17T21:59:59.999Z'],
    ['day', '2021-10-15T21:59:59.999Z'],
    ['hour', '2021-10-14T23:59:59.999Z'],
    ['minute', '2021-10-14T23:23:59.999Z'],
    ['second', '2021-10-14T23:23:58.999Z'],
  ])('zone aware endOf with unit: %s should return %s', (ut, e) => {
    const res = new DateTime('2021-10-15T01:23:58.123+02:00');
    expect(res.endOf(ut as DateTimeUnit).toJSON()).toMatchText(e);
  });

  test('startOf and endOf using defaults', () => {
    const res = new DateTime('2021-10-15T01:23:58.123Z');
    expect(res.startOf()).toMatchText(new DateTime('2021-10-15T00:00:00.000Z'));
    expect(res.endOf()).toMatchText(new DateTime('2021-10-15T23:59:59.999Z'));
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
    const d = new DateTime(iso).add(5, 'year');
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
    const d = new DateTime(iso).subtract(5, 'year');
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
    const d2 = d.add(6, 'month');
    expect(d2.diff(d, 'week')).toBe(26);
  });

  test('diff with options', () => {
    const d = new DateTime(iso);
    const d2 = d.add(2.4, 'day');
    const d3 = d.add(2.6, 'day');
    expect(d2.diff(d, 'day', { rounding: 'round' })).toBe(2);
    expect(d2.diff(d, 'day', { rounding: 'ceil' })).toBe(3);
    expect(d2.diff(d, 'day', { rounding: 'floor' })).toBe(2);
    expect(d3.diff(d, 'day', { rounding: 'round' })).toBe(3);
    expect(d3.diff(d, 'day', { rounding: 'ceil' })).toBe(3);
    expect(d3.diff(d, 'day', { rounding: 'floor' })).toBe(2);
    expect(d3.diff(d, 'day')).toBe(2);
  });

  test('from works.', () => {
    Date.now = mock.return(date.epoch + 7000);
    const d = new DateTime(iso);
    const other = new DateTime('2021-03-22T08:39:44.000Z');
    expect(d.from()).toMatchText('7 seconds ago');
    expect(d.from(other)).toMatchText('in 3 days');
    expect(d.from('nl')).toMatchText('7 seconden geleden');
    expect(d.from('de')).toMatchText('vor 7 Sekunden');
    expect(d.from(other, 'de')).toMatchText('in 3 Tagen');
    expect(d.from(other, 'nl')).toMatchText('over 3 dagen');
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
    expect(dt.toLocale('de-DE', 'ffff')).toMatchText('Donnerstag, 25. März 2021 um 08:39 UTC');
  });

  test('toFull', () => {
    const dt = new DateTime(iso);
    expect(dt.toFull()).toMatchText('25 maart 2021');
    expect(dt.toFull('nl-NL')).toMatchText('25 maart 2021');
    expect(dt.toFull('de-DE')).toMatchText('25. März 2021');
    expect(dt.toFull('de-DE')).toMatchText('25. März 2021');
  });

  test('toFormat', () => {
    const dt = new DateTime(iso);
    expect(dt.toFormat(formats.ddmmyyyy)).toBe('25/03/2021');
    expect(dt.toFormat(formats.yyyymmddthhmmss)).toBe('2021-03-25T08:39:44');
    expect(dt.toFormat(formats.yyyyddmm)).toBe('2021-03-25');
  });

  test('isDateTime', () => {
    expect(isDateTime()).toBeFalsy();
    expect(isDateTime({})).toBeFalsy();
    expect(isDateTime(new DateTime(iso))).toBeTruthy();
  });

  test('withZone changes zone', () => {
    const d = new DateTime(iso).withZone('America/New_York');
    expect(d).toMatchText(new_york);
    expect(d.toJSON()).toMatchText(iso);
    expect(d.toLocale('en-US', 'ffff')).toMatchText('Thursday, March 25, 2021 at 4:39 AM GMT-04:00');
  });

  test('toString keeps zone', () => {
    expect(new DateTime(new_york).toString()).toMatchText(new_york);
    expect(new DateTime(iso).toString()).toMatchText(iso);
  });

  test('toJSON always in UTC', () => {
    expect(new DateTime(new_york).toJSON()).toMatchText(iso);
    expect(new DateTime(iso).toJSON()).toMatchText(iso);
  });

  test('dt constructor function', () => {
    expect(dt()).not.toBeValid();
    expect(dt(iso).toJSON()).toMatchText(iso);
    expect(dt(new_york).toJSON()).toMatchText(iso);
  });
});
