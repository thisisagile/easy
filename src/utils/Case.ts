import { Get, ofGet, Predicate } from '../types';

export class Case<V, Out> {
  constructor(protected value: V, protected outcome?: Out) {}

  case(pred: Predicate<V>, out: Get<V, Out>): Case<V, Out> {
    try {
      return ofGet(pred, this.value) ? new Found(this.value, ofGet(out, this.value)) : this;
    } catch {
      return this;
    }
  }

  else(alt?: Get<V, Out>): Out { return ofGet(alt, this.value); }
}

export class Found<V, Out> extends Case<V, Out> {
  case(pred: Predicate<V>, out: Get<V, Out>): this { return this; }

  else(alt?: Get<V, Out>): Out { return this.outcome; }
}

export const choose = <V, O>(value: V): Case<V, O> => new Case(value);
