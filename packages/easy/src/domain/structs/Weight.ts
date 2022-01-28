import { UnitOfWeight } from '../enums';
import { required } from '../../validation';
import { Struct } from '../Struct';

export class Weight extends Struct {
  @required() readonly value: number = this.state.value;
  readonly UOW: UnitOfWeight = UnitOfWeight.byId(this.state.UOW, UnitOfWeight.G);
}