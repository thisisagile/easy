import { isObject } from '../types';

class Stringify {
  constructor(readonly subject: string) {}

  toCap = (): string => this.subject.charAt(0).toUpperCase() + this.subject.slice(1).toLowerCase();

  toKebab = (): string => this.subject.replace(/ /g, '-').toLowerCase();
}

export const stringify = (subject?: unknown): Stringify => new Stringify(isObject(subject) ? '' : subject?.toString() ?? '');
