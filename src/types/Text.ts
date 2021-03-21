import { isDefined } from './Is';
import { Get, isFunc, ofGet, toName } from './Constructor';
import { meta } from './Meta';
import { List, toList } from './List';

export type Text = { toString(): string };

export const isText = (t?: unknown): t is Text => isDefined(t) && isFunc<string, any>((t as any).toString);

export const asString = (t?: unknown, alt: Get<Text> = ''): string => (isText(t) ? t : ofGet(alt)).toString();

// eslint-disable-next-line security/detect-non-literal-regexp
export const replaceAll = (t: Text, search: Text, replace: Text = ''): string => asString(t).replace(new RegExp(asString(search), 'g'), asString(replace));

class Parser implements Text {
  constructor(private template: string, private subject: unknown = {}, private options = {}) {}

  toString = (): string => {
    return meta(this.options)
      .entries()
      .reduce((t, [k]) => this.option(t, k), this.object());
  };

  private value = (subject: any, prop: string): string => {
    const split = prop.split('.');
    return split
      .splice(1)
      .reduce((t: ToText, s) => (t as any)[s], text(subject[split[0]]))
      .toString();
  };

  private props = (template: string, key: string, result: List<string> = toList()): string[] => {
    const i1 = template.indexOf(`{${key}`);
    if (i1 < 0) {
      return result;
    }
    const i2 = template.indexOf('}', i1);
    return this.props(template.slice(i2 + 1), key, result.add(template.substring(i1 + 1, i2)));
  };

  private object = (): string => {
    return this.props(this.template, 'this').reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.subject, p.replace('this.', ''))), this.template);
  };

  private option = (template: string, prop: string): string => {
    return this.props(template, prop).reduce((t: string, p) => t.replace(`{${p}}`, this.value(this.options, p)), template);
  };
}

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

  parse = (subject: unknown, options = {}): ToText => text(new Parser(this.subject, subject, { type: toName(subject), ...options }));

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

export const toType = (subject: unknown, postfix = ''): ToText => text((subject as any)?.constructor?.name).replace(postfix, '');
