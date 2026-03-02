import { Entity } from '@thisisagile/easy';

export class Dev extends Entity {
  static readonly Naoufal = new Dev({ id: 2, name: 'Naoufal', level: 3 });
  static readonly Wouter = new Dev({ id: 4, name: 'Wouter', level: 3 });

  readonly name: string = this.state.name;
}
