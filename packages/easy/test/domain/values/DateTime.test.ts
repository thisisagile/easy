import { DateTime } from '../../../src';
import '@thisisagile/easy-test';
import moment from 'moment';
import { mock } from '@thisisagile/easy-test';

const iso = '2021-03-25T08:39:44.000Z';

const date = {
  iso: '2021-03-25T08:39:44.000Z',
  epoch: 1616661584000,
  ams: '2021-03-25T09:39:44+01:00',
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

  test('toLocale', () => {
    const dt = new DateTime(iso);
    expect(dt.toLocale()).toMatchText('25-3-2021');
    expect(dt.toLocale('de-DE')).toMatchText('25.3.2021');
    expect(dt.toLocale('de-DE', { dateStyle: 'full' })).toMatchText('Donnerstag, 25. März 2021');
  });
});
