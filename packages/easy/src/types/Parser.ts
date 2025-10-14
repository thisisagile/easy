import { Get, ofGet, Predicate } from './Get';
import { isDefined, isEmpty, isIn, isObject, isString, isTrue } from './Is';
import { isValid } from '../validation/Validate';
import { Constructor, on } from './Constructor';
import { toArray } from './Array';

export class Parser<T, V> {
  if = {
    equals: (pred?: Predicate<T>): Parser<T, V> => this.evaluate(isTrue, pred),
    empty: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluate(isEmpty, pred),
    defined: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluate(isDefined, pred),
    valid: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluate(isValid, pred),
    in: (...items: T[]): Parser<T, V> => this.evaluate(() => isIn(this.value, toArray(...items))),
    is: {
      object: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluate(isObject, pred),
      string: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluate(isString, pred),
      instance: <U>(c: Constructor<U>, pred?: Get<U, T>): Parser<T, V> => this.evaluate(() => this.value instanceof c, pred),
    },
    not: {
      empty: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isEmpty, pred),
      defined: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isDefined, pred),
      valid: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isValid, pred),
      isObject: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isObject, pred),
      in: (...items: T[]): Parser<T, V> => this.evaluate(() => !isIn(this.value, toArray(...items))),
      is: {
        object: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isObject, pred),
        string: <U>(pred?: Get<U, T>): Parser<T, V> => this.evaluateNot(isString, pred),
        instance: <U>(c: Constructor<U>, pred?: Get<U, T>): Parser<T, V> => this.evaluate(() => !(this.value instanceof c), pred),
      },
    },
  };

  constructor(
    protected value: T,
    protected valid = true
  ) {}

  protected evaluate<U>(meta: Get<boolean>, pred?: Get<U, T>): Parser<T, V> {
    return on(this, t => (t.valid = ofGet(meta, pred ? ofGet(pred, this.value) : this.value)));
  }

  protected evaluateNot<U>(meta: Get<boolean>, pred?: Get<U, T>): Parser<T, V> {
    return on(this, t => (t.valid = !ofGet(meta, pred ? ofGet(pred, this.value) : this.value)));
  }
}
