import { replaceAll } from '../types';

class Stringify {
  private constructor(readonly subject: string) {}

  get cap(): string {
    return this.subject.charAt(0).toUpperCase() + this.subject.slice(1).toLowerCase();
  }

  get title(): string {
    // return this.subject.split(" ").map(w => Str.cap(w)).join(" ");
    const res = this.subject.split(' ');
    const rw = res.map(w => stringify(w).cap);
      return rw.join(' ');
  }

  get pascal(): string {
    return replaceAll(this.title, ' ', '');
  }

  get lower(): string {
    return this.subject.toLowerCase();
  }

  get camel(): string {
    return this.pascal.charAt(0).toLowerCase() + this.pascal.slice(1);
  }

  get kebab(): string {
    return replaceAll(this.subject, ' ', '-').toLowerCase();
  }

  get snake(): string {
    return replaceAll(this.subject, ' ', '_').toUpperCase();
  }

  get initials(): string {
    return this.subject
      .split(' ')
      .map(w => w[0])
      .join('');
  }

  get trim(): string {
    return this.subject.replace(/ |-|,|_|#|/g, '');
  }

  static of = (subject?: unknown, alt = ''): Stringify => {
    const s = subject?.toString() ?? alt;
    return new Stringify(s !== '[object Object]' ? s : '');
  };
}

export const stringify = (subject?: unknown, alt = ''): Stringify => Stringify.of(subject, alt);
