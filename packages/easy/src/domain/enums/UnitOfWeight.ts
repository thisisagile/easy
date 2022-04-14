import { Enum } from '../../types';

export class UnitOfWeight extends Enum {
  static readonly MG = new UnitOfWeight('MilliGram', 'mg', 0.001);
  static readonly G = new UnitOfWeight('Gram', 'g', 1);
  static readonly KG = new UnitOfWeight('Kilogram', 'kg', 1000);

  constructor(name: string, id: string, readonly gMultiplier: number) {
    super(name, id);
  }
}
