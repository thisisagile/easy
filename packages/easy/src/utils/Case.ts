import { Get, ofGet, Predicate, tryTo } from '../types';

class Case<T, V = unknown> {
  constructor(protected value: V, protected outcome?: T) {}

  case(pred: Predicate<V>, out: Get<T, V>): Case<T, V> {
    return tryTo(pred, this.value).is.true()
      .map(() => ofGet<T, V>(out, this.value))
      .map(res => new Found(this.value, res) as Case<T, V>)
      .or(this);
  }

  else(alt: Get<T, V>): T {
    return ofGet(alt, this.value);
  }
}

export class Found<T, V> extends Case<T, V> {
  constructor(protected value: V, protected outcome: T) {
    super(value, outcome);
  }

  case(pred: Predicate<V>, out: Get<T, V>): this {
    return this;
  }

  else(alt: Get<T, V>): T {
    return this.outcome;
  }
}

export const choose = <T, V = unknown>(value: V): Case<T, V> => new Case(value);
