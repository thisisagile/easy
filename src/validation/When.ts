import { Constructor, isDefined, isEmpty, isIn, ofGet, Predicate, Results, Text } from '../types';
import { validate } from './Validate';
import { reject, resolve, toArray } from '../utils';

class When<T> {

  constructor(readonly subject: T, readonly invalid = true, private results?: Results) {}

  get not(): When<T> { return this.clone(!this.invalid); }

  get isDefined(): When<T> { return this.clone(this.invalid === isDefined(this.subject)); }

  get isEmpty(): When<T> { return this.clone(this.invalid === isEmpty(this.subject)); }

  get isTrue(): When<T> { return this.clone(this.invalid === !!this.subject); }

  get isValid(): When<T> {
    this.results = validate(this.subject);
    return this.clone(this.invalid === this.results.isValid);
  }

  isInstance = <U>(c: Constructor<U>): When<T> =>
    this.clone(this.invalid === this.subject instanceof c);

  with = (pred: Predicate<T>): When<T> =>
    this.clone(this.invalid === ofGet(pred, this.subject));

  in = (...items: T[]): When<T> =>
    this.clone(this.invalid === isIn(this.subject, toArray(...items)));

  is = (item: T): When<T> =>
    this.clone(this.invalid === (this.subject === item));

  reject = (error?: Text | Error): Promise<T> =>
    !this.invalid ? resolve(this.subject) : reject(this.results ?? error);

  recover = (f: (item: T) => T | Promise<T>): Promise<T> =>
    resolve(!this.invalid ? this.subject : f(this.subject));

  protected clone = (result = true): When<T> => new When(this.subject, result, this.results);
}

export const when = <T>(subject: T): When<T> => new When<T>(subject);
