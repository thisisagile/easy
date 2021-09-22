import { DateTime } from '../../../src';
import '@thisisagile/easy-test';
import moment from 'moment';
import { mock } from '@thisisagile/easy-test';

const iso = '2021-03-25T08:39:44.000Z';

describe('DateTime', () => {
  const testDate = {
    iso,
    epoch: 1616661584000,
  };

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
    const res = new DateTime(testDate.iso);
    expect(res).toBeValid();
  });

  test('construct from Date is valid.', () => {
    expect(new DateTime(new Date(testDate.epoch))).toBeValid();
  });

  test('toString from undefined returns empty string.', () => {
    const res = new DateTime(undefined as unknown as string);
    expect(res).toMatchText('');
  });

  test('toString returns iso formatted string.', () => {
    const res = new DateTime(testDate.iso);
    expect(res).toMatchText(testDate.iso);
  });

  test('toDate returns Date.', () => {
    const res = new DateTime(testDate.iso);
    expect(res.toDate()).toStrictEqual(new Date(testDate.iso));
  });

  test('toDate of invalid DateTime returns undefined.', () => {
    const res = new DateTime('Hello World');
    expect(res.toDate()).toBeUndefined();
  });

  test('toString from epoch date returns a iso string.', () => {
    Date.now = mock.return(testDate.epoch);
    const res = new DateTime(Date.now());
    expect(res).toMatchText(testDate.iso);
  });

  test('now returns iso string.', () => {
    Date.now = mock.return(testDate.epoch);
    expect(DateTime.now).toMatchText(testDate.iso);
  });

  test('from value return correct DateTime', () => {
    expect(new DateTime(testDate.iso).toJSON()).toMatchText(testDate.iso);
    expect(new DateTime(new Date(testDate.epoch)).toJSON()).toMatchText(testDate.iso);
  });

  test('add', () => {
    Date.now = mock.return(testDate.epoch);
    const d = DateTime.now.add(5);
    expect(d).toMatchText('2021-03-30T08:39:44.000Z');
  })

  test('add negative', () => {
    Date.now = mock.return(testDate.epoch);
    const d = DateTime.now.add(-5);
    expect(d).toMatchText('2021-03-20T08:39:44.000Z');
  })
});

describe('DateTime fromNow', () => {
  const testDate = {
    iso,
    now: 1622023108000,
  };

  test('from now from iso string.', () => {
    Date.now = mock.return(testDate.now);
    const res = new DateTime(testDate.iso);
    expect(res.fromNow).toMatchText('2 months ago');
  });
});

describe('DateTime isAfter', () => {
  const date = {
    now: 1622023108000,
    future: 1622023109000,
  };

  test('future is after now.', () => {
    expect(new DateTime(date.future).isAfter(new DateTime(date.now))).toBeTruthy();
  });

  test('now is not after future.', () => {
    expect(new DateTime(date.now).isAfter(new DateTime(date.future))).toBeFalsy();
  });

  test('now is not after now.', () => {
    expect(new DateTime(date.now).isAfter(new DateTime(date.future))).toBeFalsy();
  });

});

describe('DateTime toLocale', () => {

  test('toLocale', () => {
    const dt = new DateTime(iso);
    expect(dt.toLocale()).toMatchText('25-3-2021');
    expect(dt.toLocale('de-DE')).toMatchText('25.3.2021');
    expect(dt.toLocale('de-DE', {dateStyle: 'full'})).toMatchText('Donnerstag, 25. März 2021');
  });
});