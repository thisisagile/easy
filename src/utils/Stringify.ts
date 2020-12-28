class Stringify {
  constructor(readonly subject: string) {}

  toCap = (): string => this.subject.charAt(0).toUpperCase() + this.subject.slice(1);

  toTitle = (): string =>
    this.subject
      .split(' ')
      .map(w => stringify(w).toCap())
      .join(' ');

  toPascal = (): string => this.toTitle().replace(/ /g, '');

  toCamel = (): string => this.toPascal().charAt(0).toLowerCase() + this.toPascal().slice(1);

  toKebab = (): string => this.subject.replace(/ /g, '-').toLowerCase();

  toSnake = (): string => this.subject.replace(/ /g, '_').toUpperCase();

  toInitials = (): string => this.subject.split(" ").map(w => w[0]).join("");
}

export const stringify = (subject?: unknown): Stringify => {
  const s = subject?.toString() ?? '';
  return new Stringify(s !== '[object Object]' ? s : '');
};
