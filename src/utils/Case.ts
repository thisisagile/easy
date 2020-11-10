import { Get, ofGet, Predicate } from '../types';

class Case<T, V = unknown> {
  constructor(protected value: V, protected outcome?: T) {}

  case(pred: Predicate<V>, out: Get<T, V>): Case<T, V> {
    try {
      return ofGet(pred, this.value) ? new Found(this.value, ofGet(out, this.value)) : this;
    } catch {
      return this;
    }
  }

  else(alt?: Get<T, V>): T { return ofGet(alt, this.value); }
}

export class Found<T, V = unknown> extends Case<T, V> {
  case(pred: Predicate<V>, out: Get<T, V>): this { return this; }

  else(alt?: Get<T, V>): T { return this.outcome; }
}

export const choose = <T, V = unknown>(value: V): Case<T, V> => new Case(value);
