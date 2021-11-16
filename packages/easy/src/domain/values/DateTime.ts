import { isDefined, tryTo, Value } from '../../types';
import moment, { Moment } from 'moment';

export type DateTimeUnit =
  'years'
  | 'quarters'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export type Unit =
  "year" | "years" | "y" |
  "month" | "months" | "M" |
  "week" | "weeks" | "w" |
  "day" | "days" | "d" |
  "hour" | "hours" | "h" |
  "minute" | "minutes" | "m" |
  "second" | "seconds" | "s";

export class DateTime extends Value<string | undefined> {
  constructor(value?: string | number | Date, format?: string) {
    super(tryTo(value).is.defined().map(v => moment.utc(v, format, true).toISOString()).orElse());
  }

  static get now(): DateTime {
    return new DateTime(moment.utc().toISOString());
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.utc.isValid();
  }

  get fromNow(): string {
    return this.value ? this.utc.fromNow() : '';
  }

  protected get utc(): Moment {
    return moment.utc(this.value);
  }

  isAfter(dt: DateTime): boolean {
    return this.utc.isAfter(moment.utc(dt.value));
  }

  isBefore(dt: DateTime): boolean {
    return this.utc.isBefore(moment.utc(dt.value));
  }

  equals(dt: DateTime): boolean {
    return this.utc.isSame(moment.utc(dt.value));
  }

  add = (n: number, unit: DateTimeUnit = 'days'): DateTime => new DateTime(this.utc.add(n, unit).toISOString());

  subtract = (n: number, unit: DateTimeUnit = 'days'): DateTime => new DateTime(this.utc.subtract(n, unit).toISOString());

  diff = (other: DateTime, unit: DateTimeUnit = 'days'): number => this.utc.diff(other.utc, unit);

  startOf = (unitOfTime: Unit): DateTime => new DateTime(this.utc.startOf(unitOfTime).toISOString())

  endOf = (unitOfTime: Unit): DateTime => new DateTime(this.utc.endOf(unitOfTime).toISOString())

  toString(): string {
    return this.value ?? '';
  }

  toLocale(locales: string | string[] = 'nl-NL', options: Intl.DateTimeFormatOptions = {}): string {
    return this.toDate()?.toLocaleDateString(locales, options) ?? '';
  }

  toDate(): Date | undefined {
    return this.isValid ? this.utc.toDate() : undefined;
  }
}
