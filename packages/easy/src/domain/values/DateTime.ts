import { isA, isArray, isDefined, isString, tryTo, Value } from '../../types';
import moment, { Moment } from 'moment';
import { ifNotEmpty } from '../../utils';
import 'moment/min/locales';

export type DateTimeUnit =
  | 'year'
  | 'years'
  | 'y'
  | 'quarter'
  | 'quarters'
  | 'Q'
  | 'month'
  | 'months'
  | 'M'
  | 'week'
  | 'weeks'
  | 'w'
  | 'day'
  | 'days'
  | 'd'
  | 'hour'
  | 'hours'
  | 'h'
  | 'minute'
  | 'minutes'
  | 'm'
  | 'second'
  | 'seconds'
  | 's'
  | 'millisecond'
  | 'milliseconds'
  | 'ms';

export class DateTime extends Value<string | undefined> {
  constructor(value?: string | number | Date, format?: string) {
    super(
      tryTo(value)
        .is.defined()
        .map(v => moment.utc(v, format, true).toISOString())
        .orElse()
    );
  }

  static get now(): DateTime {
    return new DateTime(moment.utc().toISOString());
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.utc.isValid();
  }

  /**
   * @deprecated Deprecated in favor for DateTime.from as that also accepts locales and another DateTime
   */
  get fromNow(): string {
    return this.from();
  }

  from(date?: DateTime): string;
  from(locales?: string | string[]): string;
  from(date?: DateTime, locales?: string | string[]): string;
  from(param?: string | string[] | DateTime, other?: string | string[]): string {
    const date: DateTime | undefined = isA<DateTime>(param) ? param : undefined;
    const locales: string | string[] = isString(param) || isArray<string>(param) ? param : isString(other) || isArray<string>(other) ? other : 'en';
    return isDefined(date) ? this.utc.locale(locales).from(date.utc) : this.utc.locale(locales).fromNow();
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

  startOf = (unit: DateTimeUnit): DateTime => new DateTime(this.utc.startOf(unit).toISOString());

  endOf = (unit: DateTimeUnit): DateTime => new DateTime(this.utc.endOf(unit).toISOString());

  toString(): string {
    return this.value ?? '';
  }

  toLocale = (locales: string | string[] = 'nl-NL', format = 'L'): string => this.utc.locale(locales).format(format);

  toFull = (...locales: string[]): string => this.toLocale(ifNotEmpty(locales, locales), 'LL');

  toDate(): Date | undefined {
    return this.isValid ? this.utc.toDate() : undefined;
  }
}

export const isDateTime = (dt?: unknown): dt is DateTime => isDefined(dt) && dt instanceof DateTime;
