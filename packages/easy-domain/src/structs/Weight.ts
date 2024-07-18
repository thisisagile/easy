import { UnitOfWeight } from '../enums/UnitOfWeight';
import { Struct, required } from '@thisisagile/easy';

export class Weight extends Struct {
  @required() readonly value = this.state.value as number;
  readonly uow = UnitOfWeight.byId<UnitOfWeight>(this.state.uow, UnitOfWeight.G);

  /**
    @deprecated use inGrams getter instead
   */
  sizeInG(): number {
    return this.inGrams;
  }

  get inGrams(): number {
    return this.value * this.uow.gMultiplier;
  }

  gte(w: Weight): boolean {
    return this.inGrams >= w.inGrams;
  }
  lte(w: Weight): boolean {
    return this.inGrams <= w.inGrams;
  }

  between(lower: Weight, upper = weight(Number.MAX_VALUE, this.uow)) {
    return this.gte(lower) && this.lte(upper);
  }
  sum(add: Weight): Weight {
    return weight((this.inGrams + add.inGrams) / this.uow.gMultiplier, this.uow);
  }
}

export const weight = (value: number, uow?: UnitOfWeight): Weight => new Weight({ value, uow });
