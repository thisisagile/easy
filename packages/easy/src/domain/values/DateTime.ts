import { isDefined, Value } from '../../types';
import moment, { Moment } from 'moment';
import { ifDefined } from '../../utils';

export class DateTime extends Value<string | undefined> {
  constructor(value: string | number | Date) {
    super(ifDefined(value, moment.utc(value, true).toISOString()));
  }

  static get now(): DateTime {
    return new DateTime(moment.utc().toISOString());
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.moment.isValid();
  }

  get fromNow(): string {
    return this.value ? this.moment.fromNow() : '';
  }

  protected get moment(): Moment {
    return moment.utc(this.value, true);
  }

  isAfter(dt: DateTime): boolean {
    return this.moment.isAfter(dt.moment);
  }

  toString(): string {
    return this.value ?? '';
  }

  toLocale(locales: string | string[] = 'nl-NL', options: Intl.DateTimeFormatOptions = {}): string {
    return this.toDate()?.toLocaleDateString(locales, options) ?? '';
  }

  toDate(): Date | undefined {
    return this.isValid ? this.moment.toDate() : undefined;
  }
}
