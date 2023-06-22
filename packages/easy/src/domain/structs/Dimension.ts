import { Struct } from '../Struct';
import { required } from '../../validation';
import { UnitOfMeasurement } from '../enums';

export class Dimension extends Struct {
  @required() readonly value = this.state.value as number;
  readonly uom = UnitOfMeasurement.byId<UnitOfMeasurement>(this.state.uom, UnitOfMeasurement.MM);

  static with = (value: number, uom: UnitOfMeasurement = UnitOfMeasurement.MM) => new Dimension({ value, uom });

  /**
   @deprecated use inMilliMeters getter instead
   */
  sizeInMM(): number {
    return this.inMilliMeters;
  }

  get inMilliMeters(): number {
    return this.value * this.uom.mmMultiplier;
  }

  gte(dim: Dimension): boolean {
    return this.inMilliMeters >= dim.inMilliMeters;
  }
}
