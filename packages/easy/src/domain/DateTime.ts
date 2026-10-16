import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { Value } from '../types/Value';
import { Optional } from '../types/Types';
import { choose } from '../types/Case';
import { isDefined, isNumber, isString } from '../types/Is';
import { isDate } from '../types/IsDate';
import { JsonValue } from '../types/Json';
import { seconds } from '../utils/Seconds';
import { tryTo } from '../types/Try';
import { use } from '../types/Constructor';
import { entries } from '../types/Object';
[utc, timezone, isoWeek, quarterOfYear, advancedFormat].forEach(plugin => dayjs.extend(plugin));
dayjs.extend(customParseFormat, { parseTwoDigitYear: (year: string) => +year + (+year > 60 ? 1900 : 2000) });
dayjs.tz.setDefault('UTC');

type Unit = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type DateTimeUnit = Unit;
export type DurationUnit = Unit | `${Unit}s`;
export type Duration = Partial<Record<DurationUnit, number>>;

export type DiffOptions = {
  rounding: 'floor' | 'ceil' | 'round';
};

export type DatetimeInput = string | number | Date | DateTime | null;

export class DateTime extends Value<Optional<string>> {
  protected readonly date: Dayjs;
  protected readonly zone: Zone;
  protected readonly fraction: number;

  constructor(value?: DatetimeInput);
  constructor(value?: string, format?: string);
  constructor(value?: DatetimeInput, format?: string) {
    const parsed = choose(value)
      .type(isDateTime, v => ({ date: v.date, zone: v.zone }))
      .type(isNumber, v => ({ date: dayjs.utc(v), zone: utcZone }))
      .type(isDate, v => ({ date: dayjs.utc(v), zone: utcZone }))
      .type(isString, v => (format ? parseFormatted(v, format) : parseIso(v)))
      .else(() => ({ date: dayjs.utc(NaN), zone: utcZone }));
    super(toIso(parsed));
    this.date = parsed.date;
    this.zone = parsed.zone;
    this.fraction = choose(value)
      .type(isNumber, v => v % 1)
      .type(isDateTime, v => v.fraction)
      .else(0);
  }

  static get now(): DateTime {
    return new DateTime(Date.now());
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

  private withDate(date: Dayjs, zone = this.zone): DateTime {
    return Object.assign(new DateTime(), { date, zone, value: toIso({ date, zone }) });
  }
  from(locale?: string): string;
  from(date?: DateTime, locale?: string): string;
  from(dateOrLocale?: string | DateTime, maybeLocale?: string): string {
    const base = isDateTime(dateOrLocale) ? dateOrLocale : DateTime.now;
    const locale = isString(dateOrLocale) ? dateOrLocale : (maybeLocale ?? 'en');
    return relative(this.date, base.date, locale);
  }

  isAfter(dt: DateTime): boolean {
    return this.toEpoch() > dt.toEpoch();
  }

  isBefore(dt: DateTime): boolean {
    return this.toEpoch() < dt.toEpoch();
  }

  equals(dt: DateTime): boolean {
    return this.toEpoch() === dt.toEpoch();
  }
  add(n: number, unit?: DurationUnit): DateTime;
  add(duration: Duration): DateTime;
  add(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return this.withDate(addDuration({ date: this.date, zone: this.zone }, isNumber(n) ? { [unit]: n } : n));
  }
  subtract(n: number, unit?: DurationUnit): DateTime;
  subtract(duration: Duration): DateTime;
  subtract(n: number | Duration, unit: DurationUnit = 'day'): DateTime {
    return this.add(Object.fromEntries(entries(isNumber(n) ? { [unit]: n } : n).map(([key, value]) => [key, -value])));
  }

  diff(other: DateTime, unit: DurationUnit = 'day', opts?: DiffOptions): number {
    return Math[opts?.rounding ?? 'floor']((this.toEpoch() - other.toEpoch()) / milliseconds[unit.replace(/s$/, '') as Unit]);
  }

  startOf(unit: DurationUnit = 'day'): DateTime {
    return this.withDate(startOf({ date: this.date, zone: this.zone }, unit));
  }

  endOf(unit: DurationUnit = 'day'): DateTime {
    return this.startOf(unit).add(1, unit).subtract(1, 'millisecond');
  }

  isWeekend(): boolean {
    return this.isValid && displayDate({ date: this.date, zone: this.zone }).isoWeekday() > 5;
  }

  withZone(zone: string): DateTime {
    return tryTo(() => this.withDate(this.date, zoneOf(zone))).recoverFrom(RangeError, () => new DateTime()).value;
  }

  toString(): string {
    return this.value ?? '';
  }

  toJSON(): JsonValue {
    return this.isValid ? this.date.toISOString() : null;
  }

  toFormat(format: string): string {
    return this.toLocale('en-US', format);
  }

  toLocale(locale = 'nl-NL', format = 'D'): string {
    return this.isValid
      ? tokens(format)
          .map(token => render({ date: this.date, zone: this.zone }, token, locale))
          .join('')
      : 'Invalid DateTime';
  }

  toFull(locale?: string): string {
    return this.toLocale(locale, 'DDD');
  }

  toDate(): Optional<Date> {
    return this.isValid ? this.date.toDate() : undefined;
  }

  toEpoch(): number {
    return this.date.valueOf() + this.fraction;
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
type Zone = { type: 'utc' } | { type: 'offset'; minutes: number } | { type: 'named'; name: string };
type ZonedDate = { date: Dayjs; zone: Zone };
type Options = Intl.DateTimeFormatOptions;
const utcZone: Zone = { type: 'utc' };
const milliseconds = {
  year: 31536000000,
  quarter: 7862400000,
  month: 2592000000,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
  millisecond: 1,
};
const mapped: Record<string, string> = {
  y: 'YYYY',
  yy: 'YY',
  yyyy: 'YYYY',
  yyyyy: 'Y',
  yyyyyy: 'Y',
  d: 'D',
  dd: 'DD',
  a: 'A',
  L: 'M',
  LL: 'MM',
  LLL: 'MMM',
  LLLL: 'MMMM',
  q: 'Q',
  qq: 'Q',
  kkkk: 'GGGG',
  W: 'W',
  WW: 'WW',
  X: 'X',
  x: 'x',
  u: 'SSS',
  uu: 'SS',
  uuu: 'S',
};
const tokens = (format: string): string[] => format.match(/'[^']*(?:'|$)|([A-Za-z])\1*|[^A-Za-z']+/g) ?? [];
const literal = (token: string): boolean => token.startsWith("'") || !/^[A-Za-z]/.test(token);
const unquote = (token: string): string => token.replace(/^'|'$/g, '');
const displayDate = (v: ZonedDate): Dayjs => v.date.utc().add(offset(v), 'minute');
const offsetText = (n: number): string =>
  (n < 0 ? '-' : '+') + String(Math.floor(Math.abs(n) / 60)).padStart(2, '0') + ':' + String(Math.abs(n) % 60).padStart(2, '0');
const toIso = (v: ZonedDate): Optional<string> =>
  v.date.isValid() ? displayDate(v).toISOString().slice(0, -1) + (v.zone.type !== 'named' && !offset(v) ? 'Z' : offsetText(offset(v))) : undefined;

function offset(value: ZonedDate): number {
  if (value.zone.type === 'offset') return value.zone.minutes;
  return value.zone.type === 'named' ? value.date.tz(value.zone.name).utcOffset() : 0;
}
function zoneName(zone: Zone): string {
  if (zone.type === 'named') return zone.name;
  return zone.type === 'offset' && zone.minutes
    ? 'UTC' +
        offsetText(zone.minutes)
          .replace(/^([+-])0/, '$1')
          .replace(/:00$/, '')
    : 'UTC';
}
function zoneOf(name: string): Zone {
  const match = /^(?:UTC)?([+-])(\d{1,2})(?::?(\d{2}))?$/i.exec(name);
  if (match) return { type: 'offset', minutes: (match[1] === '-' ? -1 : 1) * (+match[2] * 60 + +(match[3] ?? 0)) };
  return /^(UTC|GMT|Z)$/i.test(name) ? utcZone : { type: 'named', name };
}
function resolveWall(wall: Dayjs, zone: Zone, guess = offset({ date: dayjs.utc(Date.now()), zone })): Dayjs {
  const next = offset({ date: wall.subtract(guess, 'minute'), zone });
  const corrected = offset({ date: wall.subtract(next, 'minute'), zone });
  return wall.subtract(next === corrected ? next : Math.min(next, corrected), 'minute');
}
function parseIso(value: string): ZonedDate {
  const parts = value.split('T');
  const timeOnly = /^\d{2}:\d{2}/.test(value);
  const calendar = timeOnly ? dayjs.utc(Date.now()).startOf('day') : isoCalendar(parts[0]);
  const clock = /^(\d{2})(?::?(\d{2}))?(?::?(\d{2})(?:[.,](\d+))?)?(Z|[+-]\d{2}(?::?\d{2})?)?$/.exec(timeOnly ? value : (parts[1] ?? '00'));
  const zone = zoneOf(clock?.[5] ?? 'UTC');
  if (!clock || parts.length > 2) return { date: dayjs.utc(NaN), zone };
  const [, h, m = '0', s = '0', ms = '0'] = clock;
  const valid = +h <= 24 && +m < 60 && +s < 60 && (+h !== 24 || +m + +s + +ms === 0);
  const wall = calendar
    .add(+h, 'hour')
    .add(+m, 'minute')
    .add(+s, 'second')
    .add(+(ms + '00').slice(0, 3), 'millisecond');
  return { date: valid ? resolveWall(wall, zone) : dayjs.utc(NaN), zone };
}
function isoCalendar(value: string): Dayjs {
  const week = /^(\d{4})-?W(\d{2})(?:-?(\d))?$/.exec(value);
  if (week) return weekDate(+week[1], +week[2], +(week[3] ?? 1));
  const ordinal = /^(\d{4})-?(\d{3})$/.exec(value);
  if (ordinal) return ordinalDate(dayjs.utc(ordinal[1] + '-01-01'), +ordinal[2]);
  const match = /^([+-]\d{6}|\d{4})(?:-?(\d{2})(?:-?(\d{2}))?)?$/.exec(value);
  if (!match) return dayjs.utc(NaN);
  const text = match[1] + '-' + (match[2] ?? '01') + '-' + (match[3] ?? '01');
  const date = dayjs.utc(new Date(text + 'T00:00:00.000Z'));
  return date.isValid() && date.toISOString().split('T')[0] === text ? date : dayjs.utc(NaN);
}
function weekDate(year: number, week: number, weekday: number): Dayjs {
  const date = dayjs
    .utc('2000-01-04')
    .year(year)
    .startOf('isoWeek')
    .add((week - 1) * 7 + weekday - 1, 'day');
  return date.isoWeekYear() === year && date.isoWeek() === week && weekday >= 1 && weekday <= 7 ? date : dayjs.utc(NaN);
}
function ordinalDate(date: Dayjs, ordinal: number): Dayjs {
  const result = date.startOf('year').add(ordinal - 1, 'day');
  return result.year() === date.year() ? result : dayjs.utc(NaN);
}
function addDuration(value: ZonedDate, duration: Duration): Dayjs {
  const units = Object.fromEntries(entries(duration).map(([unit, n]) => [unit.replace(/s$/, ''), n])) as Partial<Record<Unit, number>>;
  const whole = (unit: Unit) => Math.trunc(units[unit] ?? 0);
  const calendar = displayDate(value)
    .add(whole('year') * 12 + whole('quarter') * 3 + whole('month'), 'month')
    .add(whole('week') * 7 + whole('day'), 'day');
  const rest = entries(units).reduce(
    (total, [unit, n]) => total + (['year', 'quarter', 'month', 'week', 'day'].includes(unit) ? n % 1 : n) * milliseconds[unit as Unit],
    0
  );
  return resolveWall(calendar, value.zone, offset(value)).add(rest, 'millisecond');
}
function startOf(value: ZonedDate, unit: DurationUnit): Dayjs {
  const name = unit.replace(/s$/, '') as Unit;
  const wall = displayDate(value);
  return resolveWall(name === 'week' ? wall.startOf('isoWeek') : wall.startOf(name), value.zone, offset(value));
}
function relative(value: Dayjs, base: Dayjs, locale: string): string {
  if (!value.isValid() || !base.isValid()) return '';
  const sign = value.valueOf() < base.valueOf() ? -1 : 1;
  const units = ['year', 'month', 'day', 'hour', 'minute', 'second'] as const;
  const unit = units.find(unit => Math.abs(value.diff(base, unit, true)) >= 1) ?? 'second';
  return new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(sign * Math.floor(Math.abs(value.diff(base, unit, true))), unit);
}
function macro(token: string): Options | undefined {
  if (!/^([DtTfF])\1{0,3}$/.test(token)) return undefined;
  const size = token.length,
    kind = token[0];
  const month = ['numeric', 'short', 'long', 'long'][size - 1] as Options['month'];
  const date: Options = { year: 'numeric', month, day: 'numeric', ...(size === 4 ? { weekday: 'long' } : {}) };
  const time: Options = { hour: 'numeric', minute: 'numeric', ...(kind === 'T' ? { hourCycle: 'h23' } : {}) };
  if (kind === 'D') return date;
  if (kind === 'F' || ((kind === 't' || kind === 'T') && size > 1)) time.second = 'numeric';
  if (size > 2) time.timeZoneName = size === 3 ? 'short' : 'long';
  return kind === 't' || kind === 'T' ? time : { ...date, ...time };
}
function intl(value: ZonedDate, locale: string, options: Options): Intl.DateTimeFormatPart[] {
  const named = value.zone.type === 'named';
  const formatter = new Intl.DateTimeFormat(locale, { ...options, timeZone: named ? zoneName(value.zone) : 'UTC' });
  return formatter
    .formatToParts((named ? value.date : displayDate(value)).toDate())
    .map(part => (part.type === 'timeZoneName' && !named ? { ...part, value: zoneName(value.zone) } : part));
}
function render(value: ZonedDate, token: string, locale: string): string {
  if (literal(token)) return unquote(token);
  if (/^[Xx]$/.test(token)) return value.date.format(token);
  const options = macro(token),
    date = displayDate(value);
  if (options)
    return value.zone.type === 'named'
      ? new Intl.DateTimeFormat(locale, { ...options, timeZone: value.zone.name }).format(value.date.toDate())
      : intl(value, locale, options)
          .map(p => p.value)
          .join('');
  const width = choose(token.length)
    .equals<'narrow' | 'long' | 'short'>(5, 'narrow')
    .case(n => n === 4 || token === 'GG', 'long' as const)
    .else('short' as const);
  const nameOptions: Record<string, Options> = {
    c: { weekday: width },
    E: { weekday: width },
    L: { month: width },
    M: { month: width, day: 'numeric' },
    G: { era: width, year: 'numeric' },
    a: { hour: 'numeric', hourCycle: 'h12' },
    Z: { timeZoneName: token.length === 5 ? 'long' : 'short' },
  };
  const names: Record<string, string> = { c: 'weekday', E: 'weekday', L: 'month', M: 'month', G: 'era', a: 'dayPeriod', Z: 'timeZoneName' };
  if (/^(c{3,5}|E{3,5}|L{3,5}|M{3,5}|G|GG|GGGGG|a|Z{4,5})$/.test(token))
    return intl(value, locale, nameOptions[token[0]]).find(p => p.type === names[token[0]])?.value ?? '';
  if (token === 'z') return zoneName(value.zone);
  if (/^Z{1,3}$/.test(token))
    return choose(token)
      .equals(
        'Z',
        offsetText(offset(value))
          .replace(/^([+-])0/, '$1')
          .replace(/:00$/, '')
      )
      .equals('ZZZ', offsetText(offset(value)).replace(':', ''))
      .else(offsetText(offset(value)));
  const numbers: Record<string, number> = {
    S: date.millisecond(),
    u: date.millisecond(),
    uu: Math.floor(date.millisecond() / 10),
    uuu: Math.floor(date.millisecond() / 100),
    c: date.isoWeekday(),
    E: date.isoWeekday(),
    o: date.diff(date.startOf('year'), 'day') + 1,
    ooo: date.diff(date.startOf('year'), 'day') + 1,
    kk: date.isoWeekYear() % 100,
    qq: date.quarter(),
    yyyyyy: date.year(),
    n: date.isoWeek(),
    nn: date.isoWeek(),
    ii: date.isoWeekYear() % 100,
    iiii: date.isoWeekYear(),
  };
  const rendered = isDefined(numbers[token])
    ? String(numbers[token]).padStart(/^u+$/.test(token) ? 4 - token.length : token.length, '0')
    : date.format(mapped[token] ?? token);
  return /^\d+$/.test(rendered) ? new Intl.NumberFormat(locale, { useGrouping: false, minimumIntegerDigits: rendered.length }).format(+rendered) : rendered;
}

const escapePattern = (value: string): string => value.replace(/[$.*+?^{}()|[\]\\]/g, '\\$&').replace(/\s/g, '\\s');
const nativeToken = (token: string): string => mapped[token] ?? (/^(M{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|SSS)$/.test(token) ? token : '[' + unquote(token) + ']');
function expandMacro(token: string): string[] {
  const options = macro(token);
  if (!options) return [token];
  const map: Record<string, string> = {
    year: 'yyyy',
    month: ({ numeric: 'M', short: 'MMM', long: 'MMMM' } as Record<string, string>)[options.month ?? 'numeric'],
    day: 'd',
    weekday: 'EEEE',
    hour: options.hourCycle ? 'H' : 'h',
    minute: 'mm',
    second: 'ss',
    dayPeriod: 'a',
    timeZoneName: 'ZZZZ',
  };
  return intl({ date: dayjs.utc('2024-02-29T13:05:06Z'), zone: utcZone }, 'en-US', options).map(p => map[p.type] ?? "'" + p.value + "'");
}
function parseFormatted(value: string, format: string): ZonedDate {
  const parts = tokens(format).flatMap(expandMacro);
  const patterns = parts.map(parsePattern);
  const match = new RegExp('^' + patterns.map(p => '(' + p + ')').join('') + '$', 'i').exec(value);
  if (!match) return { date: dayjs.utc(NaN), zone: utcZone };
  const input = Object.fromEntries(parts.map((t, i) => [t, match[i + 1]]));
  if (!parts.some(t => /^(y{1,6}|[ML]{1,4}|q{1,2}|d{1,2}|[Hhms]{1,2}|S|SSS|u{1,3}|[cE]{1,4}|kk|kkkk|WW?|o|ooo)$/.test(t)))
    return { date: dayjs.utc(NaN), zone: utcZone };
  const zone = zoneOf(input.z ?? input.Z ?? input.ZZ ?? input.ZZZ ?? 'UTC');
  const now = displayDate({ date: dayjs.utc(Date.now()), zone });
  const order = [/^y/, /^[MLq]/, /^d/, /^[Hh]/, /^m/, /^s/, /^[Su]/];
  const first = order.findIndex(test => parts.some(t => test.test(t)));
  const prefix = ['YYYY', 'MM', 'DD', 'HH', 'mm', 'ss'].slice(0, first < 0 ? 3 : first).join('-');
  const converted = parts.map((token, i) => parseToken(token, match[i + 1], input.a));
  const date = dayjs.utc((prefix ? now.format(prefix) : '') + ' ' + converted.map(p => p[0]).join(''), prefix + ' ' + converted.map(p => p[1]).join(''), true);
  const corrected = parseCalendar(date, now, input);
  return { date: resolveWall(corrected, zone), zone };
}
function parsePattern(token: string): string {
  return choose(token)
    .case(literal, t => escapePattern(unquote(t)))
    .case(t => /^(y|yy|yyyy|yyyyy|yyyyyy)$/.test(t), '\\d{1,6}')
    .equals('SSS', '\\d{3}')
    .case(t => /^Z{1,3}$/.test(t), '[+-]\\d{1,2}(?::?\\d{2})?')
    .case(
      t => /^[dHhmsML]{1,2}$/.test(t),
      t => '\\d{' + (t.length === 1 ? '1,2' : '2') + '}'
    )
    .else('.+?');
}
function parseToken(token: string, input: string, meridiem?: string): [string, string] {
  if (literal(token) || token === 'a') return [input, '[' + input + ']'];
  if (/^h{1,2}$/.test(token))
    return [String((+input % (meridiem ? 12 : 24)) + (/^pm$/i.test(meridiem ?? '') ? 12 : 0)).padStart(token.length, '0'), token.toUpperCase()];
  if (/^[ML]{3,4}$/.test(token)) return [input[0].toUpperCase() + input.slice(1).toLowerCase(), nativeToken(token)];
  if (/^(S|u{1,3})$/.test(token)) return [String(token === 'S' ? +input : Math.floor(Number('0.' + input) * 1000)).padStart(3, '0'), 'SSS'];
  if (/^(y|y{3,6})$/.test(token)) return [String(+input).padStart(4, '0'), 'YYYY'];
  if (token === 'qq') return [String(+input), 'Q'];
  if (/^(c|E|ccc|cccc|EEE|EEEE|kk|kkkk|W|WW|o|ooo|G|GG|Z|ZZ|ZZZ|z)$/.test(token)) return [input, '[' + input + ']'];
  return [input, nativeToken(token)];
}
function parsedWeekday(input: Record<string, string>): string | undefined {
  return (
    input.c ??
    input.E ??
    use(
      input.ccc ?? input.EEE ?? input.cccc ?? input.EEEE,
      name => name && String(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].findIndex(day => name.startsWith(day)) + 1)
    )
  );
}
function calendarConflict(input: Record<string, string>): boolean {
  const has = (pattern: RegExp) => Object.keys(input).some(t => pattern.test(t));
  return (has(/^(o|ooo|kk|kkkk|W|WW)$/) && has(/^[MLdq]/)) || (isDefined(input.a) && has(/^H/));
}
function parseCalendar(date: Dayjs, now: Dayjs, input: Record<string, string>): Dayjs {
  const weekday = parsedWeekday(input);
  const year = input.kkkk ?? use(input.kk, y => y && String(+y + (+y > 60 ? 1900 : 2000)));
  const week = input.W ?? input.WW,
    ordinal = input.o ?? input.ooo;
  const calendar = Object.keys(input).some(t => /^[MLdq]/.test(t));
  if (!date.isValid() || calendarConflict(input)) return dayjs.utc(NaN);
  const iso = isDefined(year ?? week) || (weekday && !calendar && !isDefined(input.yyyy ?? input.yy ?? input.y));
  const result = choose(true)
    .case(Boolean(ordinal), () => ordinalDate(date, +ordinal))
    .case(Boolean(iso), () => weekDate(+(year ?? now.isoWeekYear()), +(week ?? (year ? 1 : now.isoWeek())), +(weekday ?? 1)))
    .else(date);
  if (weekday && result.isoWeekday() !== +weekday) return dayjs.utc(NaN);
  return ['BC', 'Before Christ'].includes(input.G ?? input.GG) ? result.year(-result.year()) : result;
}
