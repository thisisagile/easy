import { isDefined, Value } from '../../types';
import moment, { Moment } from 'moment';
import { ifDefined } from '../../utils';

export type DateTimeUnit = "years" | "quarters" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";

export class DateTime extends Value<string | undefined> {
  constructor(value?: string | number | Date) {
    super(ifDefined(value, moment.utc(value, true).toISOString()));
  }

  protected get utc(): Moment {
    return moment.utc(this.value);
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

  isAfter(dt: DateTime): boolean {
    return this.utc.isAfter(moment.utc(dt.value));
  }

  isBefore(dt: DateTime): boolean {
    return this.utc.isBefore(moment.utc(dt.value));
  }

  add = (n: number): DateTime => new DateTime(this.utc.add(n, 'days').toISOString());

  subtract = (n: number): DateTime => new DateTime(this.utc.subtract(n, 'days').toISOString());

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
