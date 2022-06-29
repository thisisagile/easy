import { UnitOfWeight } from '../enums';
import { required } from '../../validation';
import { Struct } from '../Struct';

export class Weight extends Struct {
  @required() readonly value = this.state.value as number;
  readonly uow = UnitOfWeight.byId<UnitOfWeight>(this.state.uow, UnitOfWeight.G);
  sizeInG = (): number => this.value * this.uow.gMultiplier;

  gte = (w: Weight): boolean => this.sizeInG() >= w.sizeInG();
  lte = (w: Weight): boolean => this.sizeInG() <= w.sizeInG();

  between = (lower: Weight, upper = weight(Number.MAX_VALUE, this.uow)) => this.gte(lower) && this.lte(upper);
  sum = (add: Weight): Weight => weight((this.sizeInG() + add.sizeInG()) / this.uow.gMultiplier, this.uow);
}

export const weight = (value: number, uow?: UnitOfWeight): Weight => new Weight({ value, uow });
