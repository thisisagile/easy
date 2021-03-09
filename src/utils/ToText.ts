import { Get, ofGet, replaceAll, Text, toString } from '../types';

class ToText implements Text {
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
    return this.title.map(s => replaceAll(s, ' '));
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
    return this.lower.map(s => replaceAll(s, ' ', '-'));
  }

  get snake(): ToText {
    return this.upper.map(s => replaceAll(s, ' ', '_'));
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

  map = (func: Get<string, string>): ToText => text(ofGet(func, this.subject));

  toString(): string {
    return this.subject;
  }
}

export const text = (subject?: unknown, alt = ''): ToText => {
  const sub = toString(subject, alt);
  return new ToText(sub !== '[object Object]' ? sub : '');
};
