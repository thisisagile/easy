import { Struct } from '../Struct';
import { required } from '../../validation';
import { UnitOfMeasurement } from '../enums';

export class Dimension extends Struct {
  @required() readonly value: number = this.state.value;
  readonly uom: UnitOfMeasurement = UnitOfMeasurement.byId(this.state.uom, UnitOfMeasurement.MM);

  static with = (value: number, uom: UnitOfMeasurement = UnitOfMeasurement.MM) => new Dimension({ value, uom });

  sizeInMM = (): number => this.value * this.uom.mmMultiplier;

  gte = (dim: Dimension): boolean => this.sizeInMM() >= dim.sizeInMM();
}