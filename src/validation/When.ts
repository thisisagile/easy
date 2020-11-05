import { results as res, Results } from './Results';
import { Constructor, isDefined, isEmpty, isError, isIn, Text } from '../types';
import { validate } from './Validate';
import { toArray } from '../utils';

class When<T> {

  constructor(readonly subject: T, readonly result = true, private results: Results = res()) {}

  get not(): When<T> { return this.clone(!this.result); }

  get isDefined(): When<T> { return this.clone(this.result === isDefined(this.subject)); }

  get isEmpty(): When<T> { return this.clone(this.result === isEmpty(this.subject)); }

  get isTrue(): When<T> { return this.clone(this.result === !!this.subject); }

  get isValid(): When<T> {
    this.results = validate(this.subject);
    return this.clone(this.result === this.results.isValid);
  }

  clone = (result = true): When<T> => new When(this.subject, result, this.results);

  isInstance = <U>(c: Constructor<U>): When<T> =>
    this.clone(this.result === this.subject instanceof c);

  with = (pred: (t: T) => boolean): When<T> =>
    this.clone(this.result === pred(this.subject));

  in = (...items: T[]): When<T> =>
    this.clone(this.result === isIn(this.subject, toArray(...items)));

  is = (item: T): When<T> =>
    this.clone(this.result === (this.subject === item));

  reject = (error?: Text | Error): Promise<T> =>
    !this.result
      ? Promise.resolve(this.subject)
      : Promise.reject(isError(error) ? error : isDefined(this.results) ? this.results : res(error));

  recover = (f: (item: T) => T | Promise<T>): Promise<T> =>
    Promise.resolve(!this.result ? this.subject : f(this.subject));
}

export const when = <T>(subject: T): When<T> => new When<T>(subject);
