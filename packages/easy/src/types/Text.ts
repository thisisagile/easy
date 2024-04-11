import { isDefined, isEmpty, isNotEmpty } from './Is';
import { toName } from './Constructor';
import { template } from './Template';
import { isFunc } from './Func';
import { Get, ofGet } from './Get';
import { toList } from './List';
import { JsonValue } from './Json';
import { Optional } from './Types';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t) && isFunc<string, any>((t as any).toString);

export const asString = (t?: unknown, alt: Get<Text> = ''): string => (isText(t) ? t : ofGet(alt)).toString();

export const replaceAll = (origin: Text, search: Text, replace: Text = ''): string => asString(origin).split(asString(search)).join(asString(replace));

export const toWords = (input: unknown): string[] => {
  return asString(input)
    .replace(/(\p{Lower})(\p{Upper})/gu, '$1 $2')
    .replace(/(\p{Upper})(\p{Upper}\p{Lower})/gu, '$1 $2')
    .split(/[_\W]+/g).filter(Boolean);
};

export const kebab = (s = ''): string => toWords(s).join('-').toLowerCase();

export class ToText implements Text {
  constructor(readonly subject: string) {}

  get cap(): ToText {
    return this.map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase());
  }

  get title(): ToText {
    return this.map(s =>
      s
        .split(' ')
        .map(w => text(w).cap)
        .join(' ')
    );
  }

  get pascal(): ToText {
    return this.title.replace(' ', '');
  }

  get lower(): ToText {
    return this.map(s => s.toLowerCase());
  }

  get upper(): ToText {
    return this.map(s => s.toUpperCase());
  }

  get camel(): ToText {
    return this.title.trim.map(s => `${s.charAt(0).toLowerCase()}${s.slice(1)}`);
  }

  get kebab(): ToText {
    return this.lower.replace(' ', '-');
  }

  get strictKebab(): ToText {
    return this.map(s => s.replace(/[^a-z\d]+/gi, ' ').trim()).kebab;
  }

  get slug(): ToText {
    return this.map(s =>
      s
        .replace(/ß/g, 'ss')
        .normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '')
        .toLowerCase()
        .replace(/[^a-z\d]+/g, '-')
        .replace(/(^-)|(-$)/g, '')
    );
  }

  get snake(): ToText {
    return this.upper.replace(' ', '_');
  }

  get plural(): ToText {
    return this.ifLike('') ?? this.add('s');
  }

  get space(): ToText {
    return this.map(s => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' '));
  }

  get sentence(): ToText {
    return this.isEmpty ? this : this.map(s => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`);
  }

  get initials(): ToText {
    return this.map(s =>
      s
        .split(' ')
        .map(w => w[0])
        .join('')
    );
  }

  get trim(): ToText {
    return this.map(s => s.replace(/[- ,_#]/g, ''));
  }

  get isEmpty(): boolean {
    return isEmpty(this.toString());
  }

  parse = (subject: unknown, options = {}): ToText => text(template(this.subject, subject, { type: toName(subject), ...options }));

  is = (...others: unknown[]): boolean => others.some(o => this.toString() === text(o).toString());

  equals = this.is;

  isLike = (...others: unknown[]): boolean => others.some(o => this.trim.lower.is(text(o).trim.lower));

  ifLike = (...others: unknown[]): Optional<this> => (this.isLike(...others) ? this : undefined);

  endsWith = (end?: unknown): boolean => this.subject.endsWith(asString(end));

  startsWith = (end?: unknown): boolean => this.subject.startsWith(asString(end));

  first = (n: number): ToText => this.map(s => s.substring(0, n));

  last = (n: number): ToText => this.map(s => s.substring(s.length - n));

  map = (func: Get<string, string>): ToText => text(ofGet(func, this.subject));

  replace = (search: Text, replace: Text): ToText => this.map(s => replaceAll(s, search, replace));

  add = (add?: unknown, separator = ''): ToText => this.map(s => (isNotEmpty(add) ? `${s}${separator}${text(add)}` : s));

  with = (separator: string, ...other: unknown[]): ToText =>
    this.map(s =>
      toList(s)
        .add(...other.map(u => text(u).toString()))
        .filter(s => isNotEmpty(s))
        .join(separator)
    );

  toString(): string {
    return this.subject;
  }

  toJSON(): JsonValue {
    return this.subject;
  }
}

export const text = (subject?: unknown, alt = ''): ToText => {
  const sub = subject ? asString(subject) : alt;
  return new ToText(sub !== '[object Object]' ? sub : '');
};
