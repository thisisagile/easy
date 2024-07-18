import { Get, ofGet, Predicate } from './Get';
import { TypeGuard } from './TypeGuard';
import { Func } from './Func';
import { isDefined, isEmpty } from './Is';
import { validate } from '../validation/Validate';
import { tryTo } from './Try';

class CaseBuilder<V> {
  constructor(readonly v: V) {}

  case<T>(pred: Predicate<V>, out: Get<T, V>): Case<T, V> {
    return new Case<T, V>(this.v).case(pred, out);
  }

  type<T, U = unknown>(guard: TypeGuard<U>, out: Func<T, U>): Case<T, V> {
    return new Case<T, V>(this.v).type<U>(guard, out);
  }

  equals<T>(value: V, out: Get<T, V>): Case<T, V> {
    return new Case<T, V>(this.v).equals(value, out);
  }

  is = {
    defined: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(isDefined(prop(this.v)), out),
    empty: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(isEmpty(prop(this.v)), out),
    valid: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(validate(prop(this.v)).isValid, out),
    not: {
      defined: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(!isDefined(prop(this.v)), out),
      empty: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(!isEmpty(prop(this.v)), out),
      valid: <T>(prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.v).case(!validate(prop(this.v)).isValid, out),
    },
  };

  if = this.is;
}

class Case<T, V = unknown> {
  constructor(
    protected value: V,
    protected outcome?: T
  ) {}

  case(pred: Predicate<V>, out: Get<T, V>): Case<T, V> {
    return tryTo(pred, this.value)
      .is.true()
      .map(() => ofGet(out, this.value))
      .map(res => new Found(this.value, res) as Case<T, V>)
      .or(this);
  }

  type<U>(guard: TypeGuard<U>, out: Func<T, U>): Case<T, V> {
    return tryTo(guard, this.value)
      .is.true()
      .map(() => out(this.value as unknown as U))
      .map(res => new Found(this.value, res) as Case<T, V>)
      .or(this);
  }

  equals(value: V, out: Get<T, V>): Case<T, V> {
    return this.case(this.value === value, out);
  }

  is = {
    defined: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(isDefined(prop(this.value)), out),
    empty: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(isEmpty(prop(this.value)), out),
    valid: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(validate(prop(this.value)).isValid, out),
    not: {
      defined: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(!isDefined(prop(this.value)), out),
      empty: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(!isEmpty(prop(this.value)), out),
      valid: (prop: Func<unknown, V>, out: Get<T, V>): Case<T, V> => new Case<T, V>(this.value).case(!validate(prop(this.value)).isValid, out),
    },
  };

  if = this.is;

  else(alt: Get<T, V>): T {
    return ofGet<T, V>(alt, this.value);
  }
}

class Found<T, V> extends Case<T, V> {
  constructor(
    protected value: V,
    protected outcome: T
  ) {
    super(value, outcome);
  }

  case(pred: Predicate<V>, out: Get<T, V>): this {
    return this;
  }

  type<U>(guard: TypeGuard<U>, out: Func<T, U>): Case<T, V> {
    return this;
  }

  equals(value: V, out: Get<T, V>): Case<T, V> {
    return this;
  }

  is = {
    defined: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
    empty: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
    valid: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
    not: {
      defined: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
      empty: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
      valid: (_prop: Func<unknown, V>, _out: Get<T, V>): Case<T, V> => this,
    },
  };

  if = this.is;

  else(alt: Get<T, V>): T {
    return this.outcome;
  }
}

export const choose = <V>(value: V) => new CaseBuilder<V>(value);
