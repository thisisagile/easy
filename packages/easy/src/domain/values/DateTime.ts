import { isDefined, Value } from '../../types';
import moment, { Moment } from 'moment';
import { ifDefined } from '../../utils';


export const ofMoment = (m?: Moment): DateTime => new DateTime(moment.utc(m).toISOString());

export class DateTime extends Value<string | undefined> {
  constructor(value: string | number | Date, protected m: Moment = moment.utc(value, true)) {
    super(ifDefined(value, m.toISOString()));
  }

  static get now(): DateTime {
    return ofMoment();
  }

  get isValid(): boolean {
    return isDefined(this.value) && this.m.isValid();
  }

  get fromNow(): string {
    return this.value ? this.m.fromNow() : '';
  }

  isAfter(dt: DateTime): boolean {
    return this.m.isAfter(dt.m);
  }

  add = (n: number): DateTime => ofMoment(this.m.add(n, 'days'));

  toString(): string {
    return this.value ?? '';
  }

  toLocale(locales: string | string[] = 'nl-NL', options: Intl.DateTimeFormatOptions = {}): string {
    return this.toDate()?.toLocaleDateString(locales, options) ?? '';
  }

  toDate(): Date | undefined {
    return this.isValid ? this.m.toDate() : undefined;
  }
}
