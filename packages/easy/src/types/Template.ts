import { List, toList } from './List';
import { asString, capitalize, replaceAll, Text } from './Text';
import { toName } from './Constructor';
import { Optional } from './Types';
import { Get, ofGet } from './Get';
import { isEmpty, isNotEmpty } from './Is';
import { JsonValue } from './Json';
import { entries } from './Object';

export type TemplateOptions = { type?: Text; property?: Text; actual?: Text; subject?: Text };

export class Template implements Text {
  constructor(
    private readonly template: string,
    private readonly subject: unknown = {},
    private readonly options: TemplateOptions = {}
  ) {}

  toString = (): string => {
    return entries(this.options)
      .reduce((t, [k]) => this.option(t, k), this.object())
      .replace('  ', ' ');
  };

  private readonly props = (tmpl: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = tmpl.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = tmpl.indexOf('}', i1);
    return this.props(tmpl.slice(i2 + 1), key, result.add(tmpl.substring(i1 + 1, i2)));
  };

  private readonly object = (): string => {
    return this.props(this.template, 'this').reduce((t: string, p) => t.replace(`{${p}}`, textValue(this.subject, p.replace('this.', ''))), this.template);
  };

  private readonly option = (tmpl: string, prop: string): string => {
    return this.props(tmpl, prop).reduce((t: string, p) => t.replace(`{${p}}`, textValue(this.options, p)), tmpl);
  };
}

export function template(tmpl: Text, subject: unknown, options: TemplateOptions = {}): Text {
  return new Template(asString(tmpl), subject, {
    type: toName(subject),
    subject: text(JSON.stringify(subject)),
    ...options,
  });
}

export class ToText implements Text {
  constructor(readonly subject: string) {}

  get cap(): ToText {
    return this.map(s => capitalize(s?.toLowerCase()));
  }

  get capFirst(): ToText {
    return this.map(s => capitalize(s));
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

  split = (separator: string = ' '): List<string> => toList(this.subject.split(separator));

  toString(): string {
    return this.subject;
  }

  toJSON(): JsonValue {
    return this.subject;
  }
}

export function text(subject?: unknown, alt = ''): ToText {
  const sub = subject ? asString(subject) : alt;
  return new ToText(sub !== '[object Object]' ? sub : '');
}

export function textValue(subject: any, prop: string): string {
  const p = prop.split('.');
  const root = subject?.[p[0]];
  const initial = typeof root === 'object' && root !== null ? root : text(root);
  return p
    .splice(1)
    .reduce((t, s) => t[s], initial)
    .toString();
}
