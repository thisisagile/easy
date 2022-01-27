import { Struct } from '../Struct';
import { required } from '../../validation';
import { UnitOfMeasurement } from '../enums';

export class Dimension extends Struct {
  @required() readonly length: number = this.state.length;
  readonly lengthUOM: UnitOfMeasurement = UnitOfMeasurement.byId(this.state.lengthUOM, UnitOfMeasurement.MM);
  @required() readonly width: number = this.state.width;
  readonly widthUOM: UnitOfMeasurement = UnitOfMeasurement.byId(this.state.widthUOM, UnitOfMeasurement.MM);
  @required() readonly height: number = this.state.height;
  readonly heightUOM: UnitOfMeasurement = UnitOfMeasurement.byId(this.state.heightUOM, UnitOfMeasurement.MM);

}
