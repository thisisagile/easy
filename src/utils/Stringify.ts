import { isObject } from '../types';

class Stringify {
  constructor(readonly subject: string) {}

  toKebab = (): string => this.subject.replace(/ /g, '-').toLowerCase();
}

export const stringify = (subject?: unknown): Stringify => new Stringify(isObject(subject) ? '' : subject?.toString() ?? '');
