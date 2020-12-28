export class Stringify {

  private constructor(readonly subject: string) {}

  get cap(): string { return this.subject.charAt(0).toUpperCase() + this.subject.slice(1); }

  get title(): string { return this.subject.split(' ').map(w => stringify(w).cap).join(' '); }

  get pascal(): string { return this.title.replace(/ /g, '');}

  get camel(): string { return this.pascal.charAt(0).toLowerCase() + this.pascal.slice(1);}

  get kebab(): string { return this.subject.replace(/ /g, '-').toLowerCase();}

  get snake(): string { return this.subject.replace(/ /g, '_').toUpperCase();}

  get initials(): string { return this.subject.split(' ').map(w => w[0]).join(''); }

  get trim(): string { return this.subject.replace(/ |-|,|_|#|/g, ''); }

  static of = (subject?: unknown): Stringify => {
    const s = subject?.toString() ?? '';
    return new Stringify(s !== '[object Object]' ? s : '');
  };
}

export const stringify = (subject?: unknown): Stringify => Stringify.of(subject);

