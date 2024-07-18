import { defined, Entity, gt, Json, lt, required, toList } from '@thisisagile/easy';

export class Dev extends Entity {
  static readonly Invalid = new Dev({ level: 1 });
  static readonly Jeroen = new Dev({ id: 1, name: 'Jeroen', level: 3 });
  static readonly Naoufal = new Dev({ id: 2, name: 'Naoufal', level: 3 });
  static readonly Sander = new Dev({ id: 3, name: 'Sander', level: 3 });
  static readonly Wouter = new Dev({ id: 4, name: 'Wouter', level: 3 });
  static readonly Rob = new Dev({ id: 5, name: 'Rob', level: 3 });
  static readonly Eugen = new Dev({ id: 6, name: 'Eugen', level: 3 });
  static readonly RobC = new Dev({ id: 6, name: 'RobC', level: 3 });
  static readonly All = toList(Dev.Sander, Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Rob, Dev.RobC);

  @required() readonly name: string = this.state.name;
  @defined() readonly language: string = this.state.language ?? 'TypeScript';
  @gt(1) @lt(10) readonly level: number = this.state.level ?? 1;

  get title(): string {
    return `${this.name} is fluent in ${this.language}.`;
  }

  toString(): string {
    return this.name;
  }

  is(d: Dev): boolean {
    return d.name === this.name;
  }

  update(add: Json): Dev {
    return new Dev(this.merge(add));
  }
}

export const devData = {
  withoutId: { Name: 'Sander', CodingLevel: '3' },
  jeroen: { Id: 54, Name: 'Jeroen', CodingLevel: '3' },
  wouter: { Id: 55, Name: 'Wouter', CodingLevel: '3', ModelingLevel: '4' },
  naoufal: { Id: 56, Name: 'Naoufal', ModelingLevel: '4' },
};
