import { DateTime as LuxonDateTime, DateTimeUnit as LuxonDateTimeUnit, DurationUnit as LuxonDurationUnit, Settings } from 'luxon';
import { Value } from '../types/Value';
import { Optional } from '../types/Types';
import { choose } from '../types/Case';
import { isDefined, isNumber, isString } from '../types/Is';
import { isDate } from '../types/IsDate';
import { isA } from '../types/IsA';
import { ifDefined } from '../utils/If';
import { JsonValue } from '../types/Json';
import { seconds } from '../utils/Seconds';
import { tryTo } from '../types/Try';
import { use } from '../types/Constructor';

Settings.defaultZone = 'utc';

export type DateTimeUnit = LuxonDateTimeUnit;
export type DurationUnit = LuxonDurationUnit;
export type Duration = Partial<Record<DurationUnit, number>>;

export type DiffOptions = {
  rounding: 'floor' | 'ceil' | 'round';
};

type DatetimeInput = string | number | Date | DateTime | null;

export class DateTime extends Value<Optional<string>> {
  protected readonly luxon: LuxonDateTime;

  constructor(value?: DatetimeInput);
  constructor(value?: string, format?: string);
  constructor(value?: DatetimeInput, format?: string) {
    const luxon = choose(value)
      .type(isString, v => (format ? LuxonDateTime.fromFormat(v, format, { setZone: true }) : LuxonDateTime.fromISO(v, { setZone: true })))
      .type(isNumber, v => LuxonDateTime.fromMillis(v))
      .type(isDate, v => LuxonDateTime.fromJSDate(v))
      .type(isDateTime, v => v.luxon)
      // Allow constructing with LuxonDateTime without exposing types
      .else(value instanceof LuxonDateTime ? value : LuxonDateTime.fromISO(undefined as any));

    super(luxon.toISO() ?? undefined);
    this.luxon = luxon;
  }

  static get now(): DateTime {
    return new DateTime(LuxonDateTime.utc() as any);
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.utc.isValid;
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

  protected get utc(): LuxonDateTime {
    return this.luxon.setZone('utc');
  }

  from(locale?: string): string;

  from(date?: DateTime, locale?: string): string;

  from(dateOrLocale?: string | DateTime, maybeLocale?: string): string {
    return (
      use((isString(dateOrLocale) ? dateOrLocale : maybeLocale) ?? 'en', locale =>
        ifDefined(
          isA<DateTime>(dateOrLocale) ? dateOrLocale : undefined,
          d => this.utc.setLocale(locale).toRelative({ base: d.utc }),
          () => this.utc.setLocale(locale).toRelative()
        )
      ) ?? ''
    );
  }

  isAfter(dt: DateTime): boolean {
    return this.utc > dt.utc;
  }

  isBefore(dt: DateTime): boolean {
    return this.utc < dt.utc;
  }

  equals(dt: DateTime): boolean {
    return this.utc.hasSame(dt.utc, 'millisecond');
  }

  add(n: number, unit?: DurationUnit): DateTime;

  add(duration: Duration): DateTime;

  add(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return new DateTime(this.luxon.plus(isNumber(n) ? { [unit]: n } : n) as any);
  }

  subtract(n: number, unit?: DurationUnit): DateTime;

  subtract(duration: Duration): DateTime;

  subtract(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return new DateTime(this.luxon.minus(isNumber(n) ? { [unit]: n } : n) as any);
  }

  diff(other: DateTime, unit: DateTimeUnit = 'day', opts?: DiffOptions): number {
    return Math[opts?.rounding ?? 'floor'](this.utc.diff(other.utc).as(unit));
  }

  startOf(unit: DateTimeUnit = 'day'): DateTime {
    return new DateTime(this.luxon.startOf(unit) as any);
  }

  endOf(unit: DateTimeUnit = 'day'): DateTime {
    return new DateTime(this.luxon.endOf(unit) as any);
  }

  isWeekend(): boolean {
    return this.luxon.isWeekend;
  }

  withZone(zone: string): DateTime {
    return new DateTime(this.luxon.setZone(zone) as any);
  }

  toString(): string {
    return this.value ?? '';
  }

  toJSON(): JsonValue {
    return this.utc.toISO();
  }

  toFormat(format: string): string {
    return this.luxon.toFormat(format);
  }

  toLocale(locale = 'nl-NL', format = 'D'): string {
    return this.luxon.setLocale(locale).toFormat(format);
  }

  toFull(locale?: string): string {
    return this.toLocale(locale, 'DDD');
  }

  toDate(): Optional<Date> {
    return this.isValid ? this.utc.toJSDate() : undefined;
  }

  toEpoch(): number {
    return this.luxon.toMillis();
  }

  ago(end: DateTime = DateTime.now): string {
    return seconds.toText(end.diff(this, 'second'));
  }

  withClock(clock: DateTime): DateTime {
    return tryTo(() => [this.toDate() as Date, clock.toDate() as Date])
      .map(([td, cd]) => new Date(td.getFullYear(), td.getMonth(), td.getDate(), cd.getHours(), cd.getMinutes(), cd.getSeconds()))
      .map(d => new DateTime(d)).value;
  }
}

export const isDateTime = (dt?: unknown): dt is DateTime => isDefined(dt) && dt instanceof DateTime;

export const dt = (dt?: DatetimeInput): DateTime => new DateTime(dt);
