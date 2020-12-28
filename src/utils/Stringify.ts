class Stringify {
  constructor(readonly subject: string) {}

  toCap = (): string => this.subject.charAt(0).toUpperCase() + this.subject.slice(1);

  toTitle = (): string => this.subject.split(' ').map(w => stringify(w).toCap()).join(' ');

  toKebab = (): string => this.subject.replace(/ /g, '-').toLowerCase();
}

export const stringify = (subject?: unknown): Stringify => {
  const s = subject?.toString() ?? '';
  return new Stringify(s !== '[object Object]' ? s : '');
};

