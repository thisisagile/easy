import dayjs, { Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/de';
import 'dayjs/locale/nl';
import { Value } from '../types/Value';
import { Optional } from '../types/Types';
import { isDefined, isNumber, isString } from '../types/Is';
import { isDate } from '../types/IsDate';
import { isA } from '../types/IsA';
import { ifDefined } from '../utils/If';
import { JsonValue } from '../types/Json';
import { seconds } from '../utils/Seconds';
import { tryTo } from '../types/Try';
import { use } from '../types/Constructor';
import { choose } from '../types/Case';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(quarterOfYear);
dayjs.tz.setDefault('UTC');

export type DateTimeUnit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type DurationUnit =
  | DateTimeUnit
  | 'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';
export type Duration = Partial<Record<DurationUnit, number>>;

export type DiffOptions = {
  rounding: 'floor' | 'ceil' | 'round';
};

export type DatetimeInput = string | number | Date | DateTime | null;

type DateTimeConstructorInput = DatetimeInput | Dayjs;
type ZonedDayjs = Dayjs & { $x?: { $timezone?: string } };

const invalidDate = dayjs.utc(Number.NaN);
const isDayjs = (value: unknown): value is Dayjs => dayjs.isDayjs(value);
const isoFormats = [
  'YYYY-MM-DD',
  'YYYY-MM-DDTHH:mm',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
  'YYYY-MM-DDTHH:mm[Z]',
  'YYYY-MM-DDTHH:mm:ss[Z]',
  'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  'YYYY-MM-DDTHH:mmZ',
  'YYYY-MM-DDTHH:mmZZ',
  'YYYY-MM-DDTHH:mm:ssZ',
  'YYYY-MM-DDTHH:mm:ssZZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZ',
  'YYYY-MM-DDTHH:mm:ss.SSSZZ',
];
const fixedUnitMilliseconds: Partial<Record<DurationUnit, number>> = {
  day: 86400000,
  days: 86400000,
  week: 604800000,
  weeks: 604800000,
};
const calendarUnitMonths: Partial<Record<DurationUnit, number>> = {
  month: 1,
  months: 1,
  quarter: 3,
  quarters: 3,
  year: 12,
  years: 12,
};

export class DateTime extends Value<Optional<string>> {
  protected readonly date: Dayjs;

  constructor(value?: DatetimeInput);
  constructor(value?: string, format?: string);
  constructor(value?: DateTimeConstructorInput, format?: string) {
    const date = choose<DateTimeConstructorInput | undefined>(value)
      .type(isDayjs, date => date)
      .type(isDateTime, dateTime => dateTime.date)
      .type(isNumber, timestamp => dayjs.utc(timestamp))
      .type(isDate, date => dayjs.utc(date))
      .type(isString, string => (string === '' ? invalidDate : format ? parseFormatted(string, format) : parseIso(string)))
      .else(invalidDate);

    super(date.isValid() ? formatDateTime(date) : undefined);
    this.date = date;
  }

  static get now(): DateTime {
    return fromDayjs(dayjs.utc(Date.now()));
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.date.isValid();
  }

  /**
   * @deprecated Deprecated in favor for DateTime.from as that also accepts locales and another DateTime
   */
  get fromNow(): string {
    return this.from();
  }

  get inAmsterdam(): DateTime {
    return this.withZone('Europe/Amsterdam');
  }

  get inNewYork(): DateTime {
    return this.withZone('America/New_York');
  }

  get inLondon(): DateTime {
    return this.withZone('Europe/London');
  }

  get inWarsaw(): DateTime {
    return this.withZone('Europe/Warsaw');
  }

  protected get utc(): Dayjs {
    return this.date.utc();
  }

  from(locale?: string): string;

  from(date?: DateTime, locale?: string): string;

  from(dateOrLocale?: string | DateTime, maybeLocale?: string): string {
    return (
      use((isString(dateOrLocale) ? dateOrLocale : maybeLocale) ?? 'en', locale =>
        ifDefined(
          isA<DateTime>(dateOrLocale) ? dateOrLocale : undefined,
          d => this.utc.locale(toDayjsLocale(locale)).from(d.utc),
          () => this.utc.locale(toDayjsLocale(locale)).from(dayjs.utc(Date.now()))
        )
      ) ?? ''
    );
  }

  isAfter(dt: DateTime): boolean {
    return this.utc.valueOf() > dt.utc.valueOf();
  }

  isBefore(dt: DateTime): boolean {
    return this.utc.valueOf() < dt.utc.valueOf();
  }

  equals(dt: DateTime): boolean {
    return this.utc.valueOf() === dt.utc.valueOf();
  }

  add(n: number, unit?: DurationUnit): DateTime;

  add(duration: Duration): DateTime;

  add(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return fromDayjs(change(this.date, n, unit, 'add'));
  }

  subtract(n: number, unit?: DurationUnit): DateTime;

  subtract(duration: Duration): DateTime;

  subtract(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return fromDayjs(change(this.date, n, unit, 'subtract'));
  }

  diff(other: DateTime, unit: DateTimeUnit = 'day', opts?: DiffOptions): number {
    return Math[opts?.rounding ?? 'floor'](this.utc.diff(other.utc, toDayjsUnit(unit) as QUnitType | OpUnitType, true));
  }

  startOf(unit: DateTimeUnit = 'day'): DateTime {
    return fromDayjs(this.date.startOf(toDayjsBoundaryUnit(unit)));
  }

  endOf(unit: DateTimeUnit = 'day'): DateTime {
    return fromDayjs(this.date.endOf(toDayjsBoundaryUnit(unit)));
  }

  isWeekend(): boolean {
    const day = this.date.day();
    return day === 0 || day === 6;
  }

  withZone(zone: string): DateTime {
    return fromDayjs(this.date.tz(zone));
  }

  toString(): string {
    return this.value ?? '';
  }

  toJSON(): JsonValue {
    return this.isValid ? this.utc.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null;
  }

  toFormat(format: string): string {
    return this.isValid ? this.date.format(toDayjsFormat(format)) : '';
  }

  toLocale(locale = 'nl-NL', format = 'D'): string {
    if (!this.isValid) return '';

    if (format === 'D') return formatWithIntl(this.date, locale, { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (format === 'DDD') return formatWithIntl(this.date, locale, { dateStyle: 'long' });
    if (format === 'ffff') {
      return formatWithIntl(this.date, locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: timezoneOf(this.date) ? 'long' : 'short',
      });
    }
    return this.date.locale(toDayjsLocale(locale)).format(toDayjsFormat(format));
  }

  toFull(locale?: string): string {
    return this.toLocale(locale, 'DDD');
  }

  toDate(): Optional<Date> {
    return this.isValid ? this.utc.toDate() : undefined;
  }

  toEpoch(): number {
    return this.date.valueOf();
  }

  ago(end: DateTime = DateTime.now): string {
    return seconds.toText(end.diff(this, 'second'));
  }

  withClock(clock: DateTime): DateTime {
    return tryTo(() => [this.toDate() as Date, clock.toDate() as Date])
      .map(([td, cd]) => new Date(Date.UTC(td.getUTCFullYear(), td.getUTCMonth(), td.getUTCDate(), cd.getUTCHours(), cd.getUTCMinutes(), cd.getUTCSeconds())))
      .map(d => new DateTime(d)).value;
  }
}

export const isDateTime = (dt?: unknown): dt is DateTime => isDefined(dt) && dt instanceof DateTime;

export const dt = (dt?: DatetimeInput): DateTime => new DateTime(dt);

const parseIso = (value: string): Dayjs => {
  const offset = offsetOf(value);
  if (offset) {
    const date = dayjs.utc(value);
    return date.isValid() ? inOffsetZone(date, offset) : invalidDate;
  }
  return dayjs(value, isoFormats, true).isValid() ? dayjs.utc(value) : invalidDate;
};

const parseFormatted = (value: string, format: string): Dayjs => {
  const dayjsFormat = toDayjsFormat(format);
  const offset = offsetOf(value);
  if (format.includes('ZZZ') && offset) {
    const iso = dayjs.utc(value);
    return iso.isValid() ? inOffsetZone(iso, offset) : invalidDate;
  }
  return dayjs.utc(value, dayjsFormat, true);
};

const offsetOf = (value: string): string | undefined => value.match(/([+-]\d{2}:?\d{2})$/)?.[1];

const fromDayjs = (date: Dayjs): DateTime => new DateTime(date as unknown as DatetimeInput);

const formatDateTime = (date: Dayjs): string => {
  const formatted = date.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  return timezoneOf(date) ? formatted : formatted.replace('+00:00', 'Z');
};

const change = (date: Dayjs, value: number | Duration, unit: DurationUnit, direction: 'add' | 'subtract'): Dayjs => {
  if (isNumber(value)) return changeUnit(date, value, unit, direction);
  return Object.entries(value).reduce((result, [durationUnit, durationValue]) => changeUnit(result, durationValue ?? 0, durationUnit as DurationUnit, direction), date);
};

const changeUnit = (date: Dayjs, value: number, unit: DurationUnit, direction: 'add' | 'subtract'): Dayjs => {
  const amount = direction === 'add' ? value : -value;
  const milliseconds = fixedUnitMilliseconds[unit];
  const months = calendarUnitMonths[unit];

  if (months && !Number.isInteger(value)) return addMonths(date, amount * months);
  if (milliseconds && !Number.isInteger(value)) return date.add(amount * milliseconds, 'millisecond');
  return date.add(amount, toDayjsUnit(unit));
};

const addMonths = (date: Dayjs, months: number): Dayjs => {
  const wholeMonths = Math.trunc(months);
  const fraction = months - wholeMonths;
  const shifted = date.add(wholeMonths, 'month');
  if (fraction === 0) return shifted;

  const next = shifted.add(months > 0 ? 1 : -1, 'month');
  return shifted.add((next.valueOf() - shifted.valueOf()) * Math.abs(fraction), 'millisecond');
};

const inOffsetZone = (date: Dayjs, offset: string): Dayjs => offsetToTimeZone(offset).map(zone => date.tz(zone)).or(date.utcOffset(offset));

const offsetToTimeZone = (offset: string) =>
  tryTo(() => {
    const [, sign, hours, minutes] = offset.match(/^([+-])(\d{2}):?(\d{2})$/) ?? [];
    if (minutes !== '00') throw new Error();
    if (hours === '00') return 'UTC';
    return `Etc/GMT${sign === '+' ? '-' : '+'}${Number(hours)}`;
  });

const toDayjsUnit = (unit: DurationUnit): ManipulateType => unit.replace(/s$/, '') as ManipulateType;

const toDayjsBoundaryUnit = (unit: DateTimeUnit): OpUnitType => {
  const dayjsUnit = toDayjsUnit(unit);
  return (dayjsUnit === 'week' ? 'isoWeek' : dayjsUnit) as OpUnitType;
};

const toDayjsFormat = (format: string): string =>
  format
    .replace(/'([^']+)'/g, '[$1]')
    .replace(/EEE/g, 'ddd')
    .replace(/yyyy/g, 'YYYY')
    .replace(/dd/g, 'DD')
    .replace(/LLL/g, 'MMM')
    .replace(/ZZZ/g, 'ZZ')
    .replace(/hh/g, 'HH');

const toDayjsLocale = (locale: string): string => locale.toLowerCase().split('-')[0];

const formatWithIntl = (date: Dayjs, locale: string, options: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(locale, { ...options, timeZone: timezoneOf(date) ?? 'UTC' }).format(date.toDate());

const timezoneOf = (date: Dayjs): string | undefined => (date as ZonedDayjs).$x?.$timezone;
