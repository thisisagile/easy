import { defined, Entity, gt, required } from '../../src';

export class Dev extends Entity {
  static readonly Invalid = new Dev({ level: 1 });
  static readonly Jeroen = new Dev({ id: 1, name: 'Jeroen', level: 3 });
  static readonly Naoufal = new Dev({ id: 2, name: 'Naoufal', level: 3 });
  static readonly Sander = new Dev({ id: 3, name: 'Sander', level: 3 });
  static readonly Wouter = new Dev({ id: 4, name: 'Wouter', level: 3 });
  @required() readonly name: string = this.state.name;
  @defined() readonly language: string = this.state.language ?? 'TypeScript';
  @gt(1) readonly level: number = this.state.level ?? 1;

  title = (): string => `${this.name} is fluent in ${this.language}.`;
}

