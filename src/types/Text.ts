import { isDefined } from './Is';
import { toName } from './Constructor';
import { template } from './Template';
import { isFunc } from './Func';
import { Get, ofGet } from './Get';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t) && isFunc<string, any>((t as any).toString);

export const asString = (t?: unknown, alt: Get<Text> = ''): string => (isText(t) ? t : ofGet(alt)).toString();

export const replaceAll = (origin: Text, search: Text, replace: Text = ''): string => asString(origin).split(asString(search)).join(asString(replace));

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
    return this.title.trim.map(s => s.charAt(0).toLowerCase() + s.slice(1));
  }

  get kebab(): ToText {
    return this.lower.replace(' ', '-');
  }

  get snake(): ToText {
    return this.upper.replace(' ', '_');
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
    return this.map(s => s.replace(/ |-|,|_|#|/g, ''));
  }

  parse = (subject: unknown, options = {}): ToText => text(template(this.subject, subject, { type: toName(subject), ...options }));

  isLike = (other?: unknown): boolean => this.trim.lower.toString() === text(other).trim.lower.toString();

  endsWith = (end?: unknown): boolean => this.subject.endsWith(asString(end));

  startsWith = (end?: unknown): boolean => this.subject.startsWith(asString(end));

  map = (func: Get<string, string>): ToText => text(ofGet(func, this.subject));

  replace = (search: Text, replace: Text): ToText => this.map(s => replaceAll(s, search, replace));

  toString(): string {
    return this.subject;
  }
}

export const text = (subject?: unknown, alt = ''): ToText => {
  const sub = subject ? asString(subject) : alt;
  return new ToText(sub !== '[object Object]' ? sub : '');
};
