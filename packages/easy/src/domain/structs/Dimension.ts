import { Struct } from '../Struct';
import { required } from '../../validation';
import { UnitOfMeasurement } from '../enums';

export class Dimension extends Struct {
  @required() readonly value = this.state.value as number;
  readonly uom = UnitOfMeasurement.byId<UnitOfMeasurement>(this.state.uom, UnitOfMeasurement.MM);

  static with = (value: number, uom: UnitOfMeasurement = UnitOfMeasurement.MM) => new Dimension({ value, uom });

  sizeInMM = (): number => this.value * this.uom.mmMultiplier;

  gte = (dim: Dimension): boolean => this.sizeInMM() >= dim.sizeInMM();
}