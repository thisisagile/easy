import { DateTime, DateTimeUnit, DurationUnit, dt, isDateTime } from '../../src';
import '@thisisagile/easy-test';
import { mock } from '@thisisagile/easy-test';

const iso = '2021-03-25T08:39:44.000Z';
const new_york = '2021-03-25T04:39:44.000-04:00';
const isoDateFormat = 'yyyy-MM-dd';
const amsterdamZone = 'Europe/Amsterdam';
const amsterdamSpringStart = '2025-03-30T00:00:00.000+01:00';
const amsterdamSpringEnd = '2025-03-30T23:59:59.999+02:00';

const date = {
  iso: '2021-03-25T08:39:44.000Z',
  epoch: 1616661584000,
  ams: '2021-03-25T09:39:44+01:00',
};
const formats = {
  ddmmyyyy: 'dd/MM/yyyy',
  yyyymmdd: 'yyyy-dd-MM',
  yyyyddmm: isoDateFormat,
  yyyymmddthhmm: "yyyy-MM-dd'T'hh:mm",
  yyyymmddhhmmss: 'yyyy-MM-dd hh:mm:ss',
  ddmmyyyyhhmmss: 'dd/MM/yyyy hh:mm:ss',
  yyyymmddthhmmss: "yyyy-MM-dd'T'hh:mm:ss",
  yyyymmddthhmmssssszzz: "yyyy-MM-dd'T'hh:mm:ss.SSSZZZ",
};

// Preserve the existing behavior when replacing the date engine.
const leapDay = '2024-02-29T00:00:00.000Z';
const leapDayWithTime = '2024-02-29T13:05:06.789Z';
const formattedLeapDay = new DateTime(leapDayWithTime);
const newYorkZone = 'America/New_York';
const lordHoweZone = 'Australia/Lord_Howe';
const todayAfternoon = '2024-06-15T13:05:00.000Z';
const monthNameDateFormat = 'MMM dd yyyy';
const zonedDateFormat = 'yyyy-MM-dd HH:mm z';
const leapDayMinute = '2024-02-29T13:05:00.000Z';
const epochStart = '1970-01-01T00:00:00.000Z';
const fullDate = 'February 29, 2024';
const fullDateTime = 'Thursday, February 29, 2024 at 1:05\u202fPM UTC';
const slashDate = '29/02/2024';
const frozenNow = Date.parse('2024-06-15T10:20:30.456Z');
const afternoon = '2024-06-15T13:00:00.000Z';
const februaryFirst = '2024-02-01T00:00:00.000Z';
const januaryFirst = '2024-01-01T00:00:00.000Z';
const plusFiveThirty = '2024-02-29T13:05:00.000+05:30';
const thursday = '2024-06-13T00:00:00.000Z';
const amsterdamSpring = '2025-03-30T12:00:00Z';
const utcTime = '13:05:06 UTC';
const parsedSecond = '2024-02-29T13:05:06.000Z';

const numericTokens: [format: string, expected: string][] = [
  ['S', '789'],
  ['SSS', '789'],
  ['u', '789'],
  ['uu', '78'],
  ['uuu', '7'],
  ['s', '6'],
  ['ss', '06'],
  ['m', '5'],
  ['mm', '05'],
  ['h', '1'],
  ['hh', '01'],
  ['H', '13'],
  ['HH', '13'],
  ['a', 'PM'],
  ['d', '29'],
  ['dd', '29'],
  ['y', '2024'],
  ['yy', '24'],
  ['yyyy', '2024'],
  ['yyyyyy', '002024'],
  ['kk', '24'],
  ['kkkk', '2024'],
  ['W', '9'],
  ['WW', '09'],
  ['n', '9'],
  ['nn', '09'],
  ['ii', '24'],
  ['iiii', '2024'],
  ['o', '60'],
  ['ooo', '060'],
  ['q', '1'],
  ['qq', '01'],
  ['Z', '+0'],
  ['ZZ', '+00:00'],
  ['ZZZ', '+0000'],
  ['ZZZZ', 'UTC'],
  ['ZZZZZ', 'UTC'],
  ['z', 'UTC'],
  ['X', '1709211906'],
  ['x', '1709211906789'],
];

const nameTokens: [format: string, expected: string][] = [
  ['c', '4'],
  ['ccc', 'Thu'],
  ['cccc', 'Thursday'],
  ['ccccc', 'T'],
  ['E', '4'],
  ['EEE', 'Thu'],
  ['EEEE', 'Thursday'],
  ['EEEEE', 'T'],
  ['L', '2'],
  ['LL', '02'],
  ['LLL', 'Feb'],
  ['LLLL', 'February'],
  ['LLLLL', 'F'],
  ['M', '2'],
  ['MM', '02'],
  ['MMM', 'Feb'],
  ['MMMM', 'February'],
  ['MMMMM', 'F'],
  ['G', 'AD'],
  ['GG', 'Anno Domini'],
  ['GGGGG', 'A'],
];

const macroTokens: [format: string, expected: string][] = [
  ['D', '2/29/2024'],
  ['DD', 'Feb 29, 2024'],
  ['DDD', fullDate],
  ['DDDD', 'Thursday, February 29, 2024'],
  ['t', '1:05\u202fPM'],
  ['tt', '1:05:06\u202fPM'],
  ['ttt', '1:05:06\u202fPM UTC'],
  ['tttt', '1:05:06\u202fPM UTC'],
  ['T', '13:05'],
  ['TT', '13:05:06'],
  ['TTT', utcTime],
  ['TTTT', utcTime],
  ['f', '2/29/2024, 1:05\u202fPM'],
  ['ff', 'Feb 29, 2024, 1:05\u202fPM'],
  ['fff', 'February 29, 2024 at 1:05\u202fPM UTC'],
  ['ffff', fullDateTime],
  ['F', '2/29/2024, 1:05:06\u202fPM'],
  ['FF', 'Feb 29, 2024, 1:05:06\u202fPM'],
  ['FFF', 'February 29, 2024 at 1:05:06\u202fPM UTC'],
  ['FFFF', 'Thursday, February 29, 2024 at 1:05:06\u202fPM UTC'],
];

const callSiteFormats: [format: string, expected: string][] = [
  ['dd/MM/yyyy', slashDate],
  ['yyyy-dd-MM', '2024-29-02'],
  [isoDateFormat, '2024-02-29'],
  ["yyyy-MM-dd'T'hh:mm", '2024-02-29T01:05'],
  ['yyyy-MM-dd hh:mm:ss', '2024-02-29 01:05:06'],
  ['dd/MM/yyyy hh:mm:ss', '29/02/2024 01:05:06'],
  ["yyyy-MM-dd'T'hh:mm:ss", '2024-02-29T01:05:06'],
  ["yyyy-MM-dd'T'hh:mm:ss.SSSZZZ", '2024-02-29T01:05:06.789+0000'],
  ['EEE MMM dd hh:mm:ss ZZZ yyyy', 'Thu Feb 29 01:05:06 +0000 2024'],
  ['yyyy-MM-dd HH:mm:ss', '2024-02-29 13:05:06'],
  ['yyyyMMdd', '20240229'],
  ['HH:mm', '13:05'],
  ['dd MMM', '29 Feb'],
  ['dd LLL HH:mm', '29 Feb 13:05'],
  ['EEE D LLL', 'Thu 2/29/2024 Feb'],
  ['M', '2'],
  ['D', '2/29/2024'],
  ['DDD', fullDate],
  ['ffff', fullDateTime],
];

const parseTokens: [input: string, format: string, expected: string][] = [
  ['7', 'S', '2024-06-15T10:20:30.007Z'],
  ['007', 'SSS', '2024-06-15T10:20:30.007Z'],
  ['789', 'u', '2024-06-15T10:20:30.789Z'],
  ['78', 'uu', '2024-06-15T10:20:30.780Z'],
  ['7', 'uuu', '2024-06-15T10:20:30.700Z'],
  ['6', 's', '2024-06-15T10:20:06.000Z'],
  ['06', 'ss', '2024-06-15T10:20:06.000Z'],
  ['5', 'm', '2024-06-15T10:05:00.000Z'],
  ['05', 'mm', '2024-06-15T10:05:00.000Z'],
  ['1 PM', 'h a', afternoon],
  ['01 PM', 'hh a', afternoon],
  ['13', 'H', afternoon],
  ['13', 'HH', afternoon],
  ['29', 'd', '2024-06-29T00:00:00.000Z'],
  ['29', 'dd', '2024-06-29T00:00:00.000Z'],
  ['4', 'c', thursday],
  ['Thu', 'ccc', thursday],
  ['Thursday', 'cccc', thursday],
  ['4', 'E', thursday],
  ['Thu', 'EEE', thursday],
  ['Thursday', 'EEEE', thursday],
  ['2', 'L', februaryFirst],
  ['02', 'LL', februaryFirst],
  ['Feb', 'LLL', februaryFirst],
  ['February', 'LLLL', februaryFirst],
  ['2', 'M', februaryFirst],
  ['02', 'MM', februaryFirst],
  ['Feb', 'MMM', februaryFirst],
  ['February', 'MMMM', februaryFirst],
  ['2024', 'y', januaryFirst],
  ['24', 'yy', januaryFirst],
  ['2024', 'yyyy', januaryFirst],
  ['02024-02-29', 'yyyyy-MM-dd', leapDay],
  ['AD 2024', 'G yyyy', januaryFirst],
  ['Anno Domini 2024', 'GG yyyy', januaryFirst],
  ['24-09-4', 'kk-WW-c', leapDay],
  ['2024-09-4', 'kkkk-WW-c', leapDay],
  ['60', 'o', leapDay],
  ['060', 'ooo', leapDay],
  ['1', 'q', januaryFirst],
  ['01', 'qq', januaryFirst],
];

const unsupportedTokens: [input: string, format: string][] = [
  ['24', 'ii'],
  ['2024', 'iiii'],
  ['9', 'n'],
  ['09', 'nn'],
  ['1709211906', 'X'],
  ['1709211906789', 'x'],
  ['F 29 2024', 'MMMMM dd yyyy'],
  ['T 2024-02-29', 'EEEEE yyyy-MM-dd'],
  ['2024-02-29 13:05 EST', 'yyyy-MM-dd HH:mm ZZZZ'],
];

describe('DateTime', () => {
  test('construct from undefined is not valid and value is undefined.', () => {
    const res = new DateTime(undefined as unknown as string);
    expect(res.value).toBeUndefined();
    expect(res).not.toBeValid();
  });

  test('construct from arbitrary object has undefined value', () => {
    const res = new DateTime({} as any);
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
    expect(new DateTime('2021-11-15')).toMatchText('2021-11-15T00:00:00.000Z');
    expect(new DateTime('2021-11-11T01:00')).toMatchText('2021-11-11T01:00:00.000Z');
    expect(new DateTime('2021-11-11T01:23:11')).toMatchText('2021-11-11T01:23:11.000Z');
    expect(new DateTime('2021-11-11T01:00:00.000+0100').toJSON()).toMatchText('2021-11-11T00:00:00.000Z');
    expect(new DateTime('2024-10-11T01:23:59.123Z')).toMatchText('2024-10-11T01:23:59.123Z');
  });

  test('toString', () => {
    expect(new DateTime('2021-11-22').toString()).toBe('2021-11-22T00:00:00.000Z');
  });

  test('equality', () => {
    expect(new DateTime('2021-11-11')).toEqual(new DateTime('2021-11-11'));
    expect(new DateTime('2021-11-12T00:00:00.000Z')).toEqual(new DateTime('2021-11-12T00:00:00.000Z'));
    expect(new DateTime('2023-11-11T00:00:00.000Z')).not.toEqual(new DateTime('2023-11-11T00:00:00.001Z'));
    expect(new DateTime('2024-01-01T01:00:00.000+0100')).not.toBe(januaryFirst);
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

  test('startOf and endOf should not break on DST changes', () => {
    const start = dt('2025-03-30T20:00').withZone(amsterdamZone).startOf('day');
    expect(start).toMatchText(amsterdamSpringStart);

    const end = dt('2025-03-30').withZone(amsterdamZone).endOf('day');
    expect(end).toMatchText(amsterdamSpringEnd);
  });

  test.each([
    ['2024-02-19', false], //Monday
    ['2024-02-20', false], // Tuesday
    ['2024-02-21', false], // Wednesday
    ['2024-02-22', false], // Thursday
    ['2024-02-23', false], // Friday
    ['2024-02-24', true], // Saturday
    ['2024-02-25', true], // Sunday
  ])('isWeekend: %s should return %s', (d, e) => {
    expect(new DateTime(d).isWeekend()).toBe(e);
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

  test('toString from null returns empty string.', () => {
    const res = new DateTime(null as unknown as string);
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
    const da = '2021-03-30T08:39:44.000Z';
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(5);
    expect(d).toMatchText(da);
    const d2 = new DateTime(iso).add(5, 'day');
    expect(d2).toMatchText(da);
    const d3 = new DateTime(iso).add({ days: 5 });
    expect(d3).toMatchText(da);
  });

  test('add other unit', () => {
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(5, 'year');
    expect(d).toMatchText('2026-03-25T08:39:44.000Z');
    const d2 = new DateTime(iso).add({ years: 5 });
    expect(d2).toMatchText('2026-03-25T08:39:44.000Z');
  });

  test('add negative', () => {
    const da = '2021-03-20T08:39:44.000Z';
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).add(-5);
    expect(d).toMatchText(da);
    const d2 = new DateTime(iso).add({ days: -5 });
    expect(d2).toMatchText(da);
  });

  test('subtract', () => {
    const da = '2021-03-20T08:39:44.000Z';
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).subtract(5);
    expect(d).toMatchText(da);
    const d2 = new DateTime(iso).subtract(5, 'day');
    expect(d2).toMatchText(da);
    const d3 = new DateTime(iso).subtract({ days: 5 });
    expect(d3).toMatchText(da);
  });

  test('subtract other unit', () => {
    const da = '2016-03-25T08:39:44.000Z';
    Date.now = mock.return(date.epoch);
    const d = new DateTime(iso).subtract(5, 'year');
    expect(d).toMatchText(da);
    const d2 = new DateTime(iso).subtract({ years: 5 });
    expect(d2).toMatchText(da);
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
    expect(d.from('de-DE')).toMatchText('vor 7 Sekunden');
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
    const d = new DateTime(iso).withZone(newYorkZone);
    expect(d).toMatchText(new_york);
    expect(d.toJSON()).toMatchText(iso);
    expect(d.toLocale('en-US', 'ffff')).toMatchText('Thursday, March 25, 2021 at 4:39 AM Eastern Daylight Time');
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
    expect(dt(new_york).toJSON()).toMatchText(iso); // from string
    expect(dt(dt(iso)).toJSON()).toMatchText(iso); // from DateTime
    expect(dt(new Date(iso)).toJSON()).toMatchText(iso); // from js Date
    expect(dt(new Date(iso).getTime()).toJSON()).toMatchText(iso); // from number
  });

  test('toEpoch', () => {
    expect(new DateTime(date.epoch).toEpoch()).toBe(date.epoch);
  });

  test('ago', () => {
    const start = dt('2021-01-01T00:00:00Z');
    const end = dt('2021-01-01T00:00:01Z');
    expect(start.ago(end)).toBe('1s');
  });

  test('ago with default end', () => {
    const start = dt('2021-01-06T00:00:00Z');
    mock.property(DateTime, 'now', dt('2021-01-10T03:03:01Z'));
    expect(start.ago()).toBe('4d 3h 3m');
  });

  test('withClock', () => {
    const start = dt('2021-02-06T00:00:00Z');
    const clock = dt('2021-01-10T03:03:01Z');
    const result = start.withClock(clock);
    expect(result).toMatchText('2021-02-06T03:03:01.000Z');
  });

  const inAmsterdam = '2021-03-25T09:39:44.000+01:00';

  test('get inAmsterdam', () => {
    const d = new DateTime(iso).inAmsterdam;
    expect(d).toMatchText(inAmsterdam);
  });

  test('get inNewYork', () => {
    const d = new DateTime(iso).inNewYork;
    expect(d).toMatchText(new_york);
  });

  test('get inLondon', () => {
    const d = new DateTime(iso).inLondon;
    expect(d).toMatchText('2021-03-25T08:39:44.000+00:00');
  });

  test('get inWarsaw', () => {
    const d = new DateTime(iso).inWarsaw;
    expect(d).toMatchText('2021-03-25T09:39:44.000+01:00');
  });

  describe('characterization', () => {
    describe('edge cases', () => {
      beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(frozenNow));
      afterEach(() => jest.restoreAllMocks());

      test.each([
        ['2024', januaryFirst],
        ['2024-02', februaryFirst],
        ['20240229', leapDay],
        ['2024-W09-4', leapDay],
        ['2024W094', leapDay],
        ['2024-060', leapDay],
        ['2024060', leapDay],
        ['2024-02-29T24:00', '2024-03-01T00:00:00.000Z'],
        ['2024-02-29T13:05:06.123456789Z', '2024-02-29T13:05:06.123Z'],
        ['2024-02-29T13:05:06,789Z', leapDayWithTime],
        ['2024-02-29T13:05+05', '2024-02-29T13:05:00.000+05:00'],
        ['0000-02-29T00:00:00Z', '0000-02-29T00:00:00.000Z'],
        ['0099-01-01T00:00:00Z', '0099-01-01T00:00:00.000Z'],
        ['+012345-01-01T00:00:00Z', '+012345-01-01T00:00:00.000Z'],
        ['-000001-01-01T00:00:00Z', '-000001-01-01T00:00:00.000Z'],
        ['13:05', todayAfternoon],
      ])('ISO %s produces %s', (value, expected) => {
        const date = new DateTime(value);
        expect(date.isValid).toBe(true);
        expect(date.toString()).toBe(expected);
        expect(date.toJSON()).toBe(new Date(expected).toISOString());
        expect(date.toEpoch()).toBe(Date.parse(expected));
      });

      test.each([
        '2024-02-29T24:01',
        '2024-02-30',
        '2023-02-29',
        '2024-13-01',
        '2024-00-01',
        '2024-01-00',
        '2024-01-32',
        '2024-02-29T25:00',
        '2024-02-29T12:60',
        '2024-02-29T12:00:60',
        '2024-W00-1',
        '2024-W54-1',
        '2024-W09-0',
        '2024-W09-8',
        '2024-000',
        '2023-366',
        '2024-367',
        'T13:05',
        'invalid',
        '',
      ])('rejects invalid ISO %s through public operations', value => {
        const date = new DateTime(value);
        for (const result of [date, date.add(1), date.subtract(1), date.startOf(), date.endOf(), date.inAmsterdam]) {
          expect(result.isValid).toBe(false);
          expect(result.toString()).toBe('');
          expect(result.toJSON()).toBeNull();
          expect(result.toEpoch()).toBeNaN();
          expect(result.toDate()).toBeUndefined();
        }
        expect(date.from()).toBe('');
        expect(date.equals(date)).toBe(false);
        expect(date.isWeekend()).toBe(false);
        expect(() => date.withClock(new DateTime(leapDay))).toThrow();
      });

      test.each([
        ['13', 'hh', afternoon],
        ['00 AM', 'hh a', '2024-06-15T00:00:00.000Z'],
        ['20240229', 'yyyyMMdd', leapDay],
        ['Feb 29 2024', monthNameDateFormat, leapDay],
        ['feb 29 2024', monthNameDateFormat, leapDay],
        ['FEB 29 2024', monthNameDateFormat, leapDay],
        ['23', 'H', '2024-06-15T23:00:00.000Z'],
        ['59', 'm', '2024-06-15T10:59:00.000Z'],
        ['59', 's', '2024-06-15T10:20:59.000Z'],
        ['999', 'S', '2024-06-15T10:20:30.999Z'],
        ['366', 'ooo', '2024-12-31T00:00:00.000Z'],
      ])('parses boundary %s with %s', (value, format, expected) => {
        expect(new DateTime(value, format).toString()).toBe(expected);
      });

      test.each([
        ['ii', 'ii'],
        ['X', 'X'],
        ['x', 'x'],
        ['literal', "'literal'"],
        ['2024-02-29 Fri', 'yyyy-MM-dd EEE'],
        ['2024-54-1', 'kkkk-WW-c'],
        ['2024-00-1', 'kkkk-WW-c'],
        ['000', 'ooo'],
        ['367', 'ooo'],
        ['0', 'q'],
        ['5', 'q'],
        ['60', 's'],
        ['60', 'm'],
        ['25', 'H'],
        ['32', 'd'],
        ['0', 'd'],
        ['13', 'M'],
        ['0', 'M'],
        ['1000', 'SSS'],
        ['-1', 'S'],
        ['1.5', 'S'],
        ['0001', 'SSS'],
      ])('rejects parse boundary %s with %s', (value, format) => {
        expect(new DateTime(value, format).isValid).toBe(false);
      });

      test.each([
        ['13 PM', 'H a'],
        ['2024-09-4 02', 'kkkk-WW-c MM'],
        ['2024-02-29 060', 'yyyy-MM-dd ooo'],
      ])('rejects conflicting fields %s with %s', (value, format) => {
        expect(new DateTime(value, format).isValid).toBe(false);
      });

      test.each([
        ['UTC', leapDayWithTime],
        ['UTC+0:01', '2024-02-29T13:06:06.789+00:01'],
        ['UTC-0:01', '2024-02-29T13:04:06.789-00:01'],
        ['UTC+5:45', '2024-02-29T18:50:06.789+05:45'],
        ['UTC+14', '2024-03-01T03:05:06.789+14:00'],
        ['UTC-12', '2024-02-29T01:05:06.789-12:00'],
        ['Europe/London', '2024-02-29T13:05:06.789+00:00'],
        [amsterdamZone, '2024-02-29T14:05:06.789+01:00'],
        [newYorkZone, '2024-02-29T08:05:06.789-05:00'],
        [lordHoweZone, '2024-03-01T00:05:06.789+11:00'],
        ['Pacific/Apia', '2024-03-01T02:05:06.789+13:00'],
      ])('preserves zone %s and the UTC instant', (zone, expected) => {
        const date = new DateTime(leapDayWithTime).withZone(zone);
        expect(date.toString()).toBe(expected);
        expect(date.toJSON()).toBe(leapDayWithTime);
        expect(date.toEpoch()).toBe(1709211906789);
        expect(date.toFormat('X x')).toBe('1709211906 1709211906789');
        expect(new DateTime(date).toString()).toBe(expected);
        expect(new DateTime(date.toString()).toEpoch()).toBe(date.toEpoch());
      });

      test('invalid zone produces an invalid date', () => {
        expect(new DateTime(leapDayWithTime).withZone('Invalid/Zone').isValid).toBe(false);
      });

      test.each([
        ['2025-03-30 02:30', amsterdamZone, '2025-03-30T03:30:00.000+02:00'],
        ['2025-10-26 02:30', amsterdamZone, '2025-10-26T02:30:00.000+02:00'],
        ['2025-03-09 02:30', newYorkZone, '2025-03-09T03:30:00.000-04:00'],
        ['2025-11-02 01:30', newYorkZone, '2025-11-02T01:30:00.000-04:00'],
        ['2025-04-06 01:45', lordHoweZone, '2025-04-06T01:45:00.000+10:30'],
        ['2025-10-05 02:15', lordHoweZone, '2025-10-05T02:45:00.000+11:00'],
      ])('resolves gap or fold %s in %s', (value, zone, expected) => {
        expect(new DateTime(value + ' ' + zone, zonedDateFormat).toString()).toBe(expected);
      });

      test.each([
        ['year', januaryFirst, '2024-12-31T23:59:59.999Z'],
        ['quarter', januaryFirst, '2024-03-31T23:59:59.999Z'],
        ['month', februaryFirst, '2024-02-29T23:59:59.999Z'],
        ['week', '2024-02-26T00:00:00.000Z', '2024-03-03T23:59:59.999Z'],
        ['day', leapDay, '2024-02-29T23:59:59.999Z'],
        ['hour', '2024-02-29T13:00:00.000Z', '2024-02-29T13:59:59.999Z'],
        ['minute', leapDayMinute, '2024-02-29T13:05:59.999Z'],
        ['second', '2024-02-29T13:05:06.000Z', '2024-02-29T13:05:06.999Z'],
        ['millisecond', leapDayWithTime, leapDayWithTime],
      ] as [DateTimeUnit, string, string][])('boundaries of %s', (unit, start, end) => {
        const date = new DateTime(leapDayWithTime);
        expect(date.startOf(unit).toString()).toBe(start);
        expect(date.endOf(unit).toString()).toBe(end);
        expect(date.toString()).toBe(leapDayWithTime);
      });

      test.each([
        ['year', '2025-08-30T01:05:06.789Z', '2022-08-30T01:05:06.789Z'],
        ['quarter', '2024-07-14T01:05:06.789Z', '2023-10-15T01:05:06.789Z'],
        ['month', '2024-04-13T13:05:06.789Z', '2024-01-14T13:05:06.789Z'],
        ['week', '2024-03-11T01:05:06.789Z', '2024-02-19T01:05:06.789Z'],
        ['day', '2024-03-02T01:05:06.789Z', '2024-02-28T01:05:06.789Z'],
        ['hour', '2024-02-29T14:35:06.789Z', '2024-02-29T11:35:06.789Z'],
        ['minute', '2024-02-29T13:06:36.789Z', '2024-02-29T13:03:36.789Z'],
        ['second', '2024-02-29T13:05:08.289Z', '2024-02-29T13:05:05.289Z'],
        ['millisecond', '2024-02-29T13:05:06.790Z', '2024-02-29T13:05:06.787Z'],
      ] as [DateTimeUnit, string, string][])('fractional %s and its plural', (unit, added, subtracted) => {
        const date = new DateTime(leapDayWithTime);
        for (const name of [unit, unit + 's'] as DurationUnit[]) {
          expect(date.add(1.5, name).toString()).toBe(added);
          expect(date.subtract(1.5, name).toString()).toBe(subtracted);
          expect(date.add(-1.5, name).toString()).toBe(subtracted);
        }
        expect(date.toString()).toBe(leapDayWithTime);
      });

      test.each(['2024-01-31', '2024-02-29', '2025-03-30', '2025-10-26'])('mixed unit order at %s', value => {
        const date = new DateTime(value).inAmsterdam;
        const forward = { years: 1, months: 1, days: 2, hours: 3.5 };
        const reversed = { hours: 3.5, days: 2, months: 1, years: 1 };
        expect(date.add(forward).toString()).toBe(date.add(reversed).toString());
        expect(date.subtract(forward).toString()).toBe(date.subtract(reversed).toString());
        expect(date.toJSON()).toBe(value + 'T00:00:00.000Z');
      });

      describe.each([
        ['year', 31536000000],
        ['quarter', 7862400000],
        ['month', 2592000000],
        ['week', 604800000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
        ['second', 1000],
        ['millisecond', 1],
      ] as [DateTimeUnit, number][])('elapsed %s', (unit, milliseconds) => {
        test.each([-1.5, -1, -0.5, 0, 0.5, 1, 1.5])('rounds duration %s', count => {
          const base = new DateTime('2024-01-31T12:00:00Z');
          const date = new DateTime(base.toEpoch() + count * milliseconds);
          expect(date.diff(base, unit)).toBe(Math.floor(count));
          expect(date.diff(base, unit, { rounding: 'ceil' })).toBe(Math.ceil(count));
          expect(date.diff(base, unit, { rounding: 'round' })).toBe(Math.round(count));
        });
      });

      test.each([
        [0, epochStart],
        [-1, '1969-12-31T23:59:59.999Z'],
        [1, '1970-01-01T00:00:00.001Z'],
        [0.5, epochStart],
        [-0.5, epochStart],
        [8640000000000000, '+275760-09-13T00:00:00.000Z'],
        [-8640000000000000, '-271821-04-20T00:00:00.000Z'],
      ] as [number, string][])('epoch %s serializes as %s', (value, expected) => {
        expect(new DateTime(value).toString()).toBe(expected);
        expect(new DateTime(new Date(value)).toString()).toBe(expected);
      });

      test.each([NaN, Infinity, -Infinity, 8640000000000001, -8640000000000001])('rejects epoch %s', value => {
        expect(new DateTime(value).isValid).toBe(false);
        expect(new DateTime(new Date(value)).isValid).toBe(false);
      });
    });
    describe('formatting', () => {
      test.each([...numericTokens, ...nameTokens, ...macroTokens])('%s formats as %s', (format, expected) => {
        expect(formattedLeapDay.toFormat(format)).toBe(expected);
      });

      test.each(callSiteFormats)('preserves call-site format %s', (format, expected) => {
        expect(formattedLeapDay.toFormat(format)).toBe(expected);
      });

      test.each([
        ["yyyy-MM-dd'T'HH:mm:ss.SSSZZZ", '2024-02-29T13:05:06.789+0000'],
        ["'Date:' yyyy-MM-dd", 'Date: 2024-02-29'],
        ["'It''s' HH:mm", 'Its 13:05'],
        ['yyyyMMddHHmmss', '20240229130506'],
        ['foo', '2/29/2024, 1:05\u202fPMoo'],
        ['yyyy/LL/dd -- HH:mm', '2024/02/29 -- 13:05'],
      ])('preserves format grammar for %s', (format, expected) => {
        expect(formattedLeapDay.toFormat(format)).toBe(expected);
      });

      test.each([
        ['2019-12-30T00:00:00Z', '2020-01-1'],
        ['2021-01-03T00:00:00Z', '2020-53-7'],
        ['2021-01-04T00:00:00Z', '2021-01-1'],
      ])('formats ISO week-year boundaries for %s', (value, expected) => {
        expect(new DateTime(value).toFormat('kkkk-WW-c')).toBe(expected);
      });

      test.each([
        ['2024-02-29T00:05:06.789Z', '12 12 0 00 AM'],
        ['2024-02-29T12:05:06.789Z', '12 12 12 12 PM'],
        [leapDayWithTime, '1 01 13 13 PM'],
      ])('preserves twelve and twenty-four hour tokens for %s', (value, expected) => {
        expect(new DateTime(value).toFormat('h hh H HH a')).toBe(expected);
      });

      test.each([
        ['2024-02-29T13:05:06.789+02:00', '13:05 +02:00 +0200 UTC+2 UTC+2 UTC+2'],
        ['2024-02-29T13:05:06.789-04:30', '13:05 -04:30 -0430 UTC-4:30 UTC-4:30 UTC-4:30'],
      ])('preserves fixed offset formatting for %s', (value, expected) => {
        expect(new DateTime(value).toFormat('HH:mm ZZ ZZZ ZZZZ ZZZZZ z')).toBe(expected);
      });

      test.each([
        ['nl-NL', '29-2-2024', '29 februari 2024', 'donderdag 29 februari 2024 om 13:05 UTC'],
        ['de-DE', '29.2.2024', '29. Februar 2024', 'Donnerstag, 29. Februar 2024 um 13:05 UTC'],
        ['de-AT', '29.2.2024', '29. Februar 2024', 'Donnerstag, 29. Februar 2024 um 13:05 UTC'],
        ['en-US', '2/29/2024', fullDate, fullDateTime],
        ['en-GB', slashDate, '29 February 2024', 'Thursday, 29 February 2024 at 13:05 UTC'],
        ['fr-FR', slashDate, '29 février 2024', 'jeudi 29 février 2024 à 13:05 UTC'],
        ['pl-PL', '29.02.2024', '29 lutego 2024', 'czwartek, 29 lutego 2024 13:05 UTC'],
        ['ar-EG', '٢٩\u200f/٢\u200f/٢٠٢٤', '٢٩ فبراير ٢٠٢٤', 'الخميس، ٢٩ فبراير ٢٠٢٤ في ١:٠٥ م UTC'],
      ])('preserves Intl output for %s', (locale, short, full, dateTime) => {
        expect(formattedLeapDay.toLocale(locale, 'D')).toBe(short);
        expect(formattedLeapDay.toFull(locale)).toBe(full);
        expect(formattedLeapDay.toLocale(locale, 'ffff')).toBe(dateTime);
      });

      test('preserves invalid DateTime formatting', () => {
        const invalid = new DateTime('invalid');

        expect(invalid.toFormat(isoDateFormat)).toBe('Invalid DateTime');
        expect(invalid.toLocale('en-US', 'D')).toBe('Invalid DateTime');
      });
    });

    describe('parsing', () => {
      beforeEach(() => jest.spyOn(Date, 'now').mockReturnValue(frozenNow));

      afterEach(() => jest.restoreAllMocks());

      test.each(parseTokens)('parses %s with %s', (input, format, expected) => {
        const result = new DateTime(input, format);

        expect(result.isValid).toBe(true);
        expect(result.toString()).toBe(expected);
      });

      test.each([
        ['49-01-02', '2049-01-02T00:00:00.000Z'],
        ['60-01-02', '2060-01-02T00:00:00.000Z'],
        ['61-01-02', '1961-01-02T00:00:00.000Z'],
        ['99-01-02', '1999-01-02T00:00:00.000Z'],
        ['00-01-02', '2000-01-02T00:00:00.000Z'],
      ])('preserves the two-digit year cutoff for %s', (input, expected) => {
        expect(new DateTime(input, 'yy-MM-dd').toString()).toBe(expected);
      });

      test.each([
        ['23:07', 'HH:mm', '2024-06-15T23:07:00.000Z'],
        ['02-29', 'MM-dd', leapDay],
        ['2025', 'yyyy', '2025-01-01T00:00:00.000Z'],
        ['11', 'MM', '2024-11-01T00:00:00.000Z'],
        ['17', 'dd', '2024-06-17T00:00:00.000Z'],
      ])('preserves missing-field defaults for %s', (input, format, expected) => {
        expect(new DateTime(input, format).toString()).toBe(expected);
      });

      test.each([
        ['2024-02-29 13:05 +5:30', 'yyyy-MM-dd HH:mm Z', plusFiveThirty],
        ['2024-02-29 13:05 +05:30', 'yyyy-MM-dd HH:mm ZZ', plusFiveThirty],
        ['2024-02-29 13:05 +0530', 'yyyy-MM-dd HH:mm ZZZ', plusFiveThirty],
        ['2024-02-29 13:05 -04:30', 'yyyy-MM-dd HH:mm ZZ', '2024-02-29T13:05:00.000-04:30'],
        ['2024-02-29 13:05 America/New_York', zonedDateFormat, '2024-02-29T13:05:00.000-05:00'],
      ])('preserves parsed zone for %s', (input, format, expected) => {
        expect(new DateTime(input, format).toString()).toBe(expected);
      });

      test.each([
        ['2025-03-30 02:30 Europe/Amsterdam', '2025-03-30T03:30:00.000+02:00'],
        ['2025-10-26 02:30 Europe/Amsterdam', '2025-10-26T02:30:00.000+02:00'],
        ['2025-03-30 01:30 Europe/London', '2025-03-30T02:30:00.000+01:00'],
        ['2025-10-26 01:30 Europe/London', '2025-10-26T01:30:00.000+01:00'],
      ])('preserves DST gap and fold parsing for %s', (input, expected) => {
        expect(new DateTime(input, zonedDateFormat).toString()).toBe(expected);
      });

      test.each([
        ['2/29/2024', 'D', leapDay],
        ['Feb 29, 2024', 'DD', leapDay],
        ['February 29, 2024', 'DDD', leapDay],
        ['Thursday, February 29, 2024', 'DDDD', leapDay],
        ['1:05 PM', 't', todayAfternoon],
        ['1:05:06 PM', 'tt', '2024-06-15T13:05:06.000Z'],
        ['13:05', 'T', todayAfternoon],
        ['13:05:06', 'TT', '2024-06-15T13:05:06.000Z'],
        ['2/29/2024, 1:05 PM', 'f', leapDayMinute],
        ['Feb 29, 2024, 1:05 PM', 'ff', leapDayMinute],
        ['2/29/2024, 1:05:06 PM', 'F', parsedSecond],
        ['Feb 29, 2024, 1:05:06 PM', 'FF', parsedSecond],
      ])('preserves supported macro parsing for %s', (input, format, expected) => {
        expect(new DateTime(input, format).toString()).toBe(expected);
      });

      test.each([
        ['1:05:06 PM UTC', 'ttt'],
        ['1:05:06 PM UTC', 'tttt'],
        [utcTime, 'TTT'],
        [utcTime, 'TTTT'],
        ['February 29, 2024 at 1:05 PM UTC', 'fff'],
        ['Thursday, February 29, 2024 at 1:05 PM UTC', 'ffff'],
        ['February 29, 2024 at 1:05:06 PM UTC', 'FFF'],
        ['Thursday, February 29, 2024 at 1:05:06 PM UTC', 'FFFF'],
        ...unsupportedTokens,
      ])('records unsupported parse input %s with %s', (input, format) => {
        expect(new DateTime(input, format).isValid).toBe(false);
      });

      test('records that Z does not parse the literal Z', () => {
        expect(new DateTime('2024-02-29 13:05 Z', 'yyyy-MM-dd HH:mm Z').isValid).toBe(false);
      });

      test('records a mismatched weekday as invalid', () => {
        expect(new DateTime('2024-02-29 Fri', 'yyyy-MM-dd EEE').isValid).toBe(false);
      });

      test('records incompatible calendar fields as invalid', () => {
        expect(new DateTime('2024-02-29 061', 'yyyy-MM-dd ooo').isValid).toBe(false);
      });
    });

    describe('behavior', () => {
      test('diff remains elapsed-time based across DST changes', () => {
        const springStart = new DateTime('2025-03-30T00:00:00+01:00');
        const springEnd = new DateTime('2025-03-31T00:00:00+02:00');
        const autumnStart = new DateTime('2025-10-26T00:00:00+02:00');
        const autumnEnd = new DateTime('2025-10-27T00:00:00+01:00');

        expect(springEnd.diff(springStart, 'hour')).toBe(23);
        expect(springEnd.diff(springStart, 'day')).toBe(0);
        expect(autumnEnd.diff(autumnStart, 'hour')).toBe(25);
        expect(autumnEnd.diff(autumnStart, 'day')).toBe(1);
      });

      test.each([
        [amsterdamZone, amsterdamSpring, amsterdamSpringStart, amsterdamSpringEnd],
        [amsterdamZone, '2025-10-26T12:00:00Z', '2025-10-26T00:00:00.000+02:00', '2025-10-26T23:59:59.999+01:00'],
        [newYorkZone, '2025-03-09T12:00:00Z', '2025-03-09T00:00:00.000-05:00', '2025-03-09T23:59:59.999-04:00'],
        ['Europe/London', amsterdamSpring, '2025-03-30T00:00:00.000+00:00', '2025-03-30T23:59:59.999+01:00'],
        ['Europe/Warsaw', amsterdamSpring, amsterdamSpringStart, amsterdamSpringEnd],
      ])('preserves %s day boundaries', (zone, value, start, end) => {
        const date = new DateTime(value).withZone(zone);

        expect(date.startOf('day').toString()).toBe(start);
        expect(date.endOf('day').toString()).toBe(end);
      });

      test('preserves mixed duration arithmetic and immutability', () => {
        const value = new DateTime(leapDayWithTime);

        expect(value.add({ months: 1, days: 1, hours: 2 }).toString()).toBe('2024-03-30T15:05:06.789Z');
        expect(value.subtract({ months: 1, days: 1, hours: 2 }).toString()).toBe('2024-01-28T11:05:06.789Z');
        expect(value.toString()).toBe(leapDayWithTime);
      });

      test('preserves fractional duration arithmetic', () => {
        const value = new DateTime(leapDay);

        expect(value.add(1.5, 'day').toString()).toBe('2024-03-01T12:00:00.000Z');
        expect(value.subtract(1.5, 'hour').toString()).toBe('2024-02-28T22:30:00.000Z');
      });

      test('preserves relative output across locales', () => {
        const start = new DateTime('2024-02-26T13:05:06.789Z');
        const end = new DateTime(leapDayWithTime);

        expect(start.from(end, 'en-US')).toBe('3 days ago');
        expect(start.from(end, 'nl-NL')).toBe('3 dagen geleden');
        expect(start.from(end, 'de-DE')).toBe('vor 3 Tagen');
        expect(start.from(end, 'fr-FR')).toBe('il y a 3 jours');
        expect(start.from(end, 'pl-PL')).toBe('3 dni temu');
      });

      test('withClock copies UTC time fields and drops milliseconds', () => {
        const value = new DateTime(leapDay);
        const clock = new DateTime('1970-01-01T13:05:06.789Z');

        expect(value.withClock(clock).toString()).toBe(parsedSecond);
      });
    });
  });
});
