import { Enum } from '../../types';

export class UnitOfMeasurement extends Enum {
  static readonly MM = new UnitOfMeasurement('Millimeter', 'mm', 1);
  static readonly CM = new UnitOfMeasurement('Centimeter', 'cm', 10);
  static readonly DM = new UnitOfMeasurement('Decimeter', 'dm', 100);
  static readonly M = new UnitOfMeasurement('Meter', 'm', 1000);
  static readonly KM = new UnitOfMeasurement('Kilometer', 'km', 1000000);

  constructor(name: string, id: string, readonly mmMultiplier: number) {
    super(name, id);
  }
}
