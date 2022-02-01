import { UnitOfWeight } from '../enums';
import { required } from '../../validation';
import { Struct } from '../Struct';

export class Weight extends Struct {
  @required() readonly value: number = this.state.value;
  readonly uow: UnitOfWeight = UnitOfWeight.byId(this.state.uow, UnitOfWeight.G);
}