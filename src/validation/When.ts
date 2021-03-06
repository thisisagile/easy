import { Constructor, ErrorOrigin, Get, isDefined, isEmpty, isIn, ofGet, Predicate, Results, toArray } from '../types';
import { validate } from './Validate';
import { reject, resolve } from '../utils';

export class When<T> {
  constructor(readonly subject: T, readonly valid = true, private results?: Results) {}

  get not(): When<T> {
    return this.clone(!this.valid);
  }

  get isDefined(): When<T> {
    return this.clone(this.valid === isDefined(this.subject));
  }

  get isEmpty(): When<T> {
    return this.clone(this.valid === isEmpty(this.subject));
  }

  get isTrue(): When<T> {
    return this.clone(this.valid === !!this.subject);
  }

  get isValid(): When<T> {
    this.results = validate(this.subject);
    return this.clone(this.valid === this.results.isValid);
  }

  isInstance = <U>(c: Constructor<U>): When<T> => this.clone(this.valid === this.subject instanceof c);

  with = (pred: Predicate<T>): When<T> => this.clone(this.valid === ofGet(pred, this.subject));

  contains = (property: Get<unknown, T>): When<T> => this.clone(this.valid === isDefined(ofGet(property, this.subject)));

  in = (...items: T[]): When<T> => this.clone(this.valid === isIn(this.subject, toArray(...items)));

  is = (item: T): When<T> => this.clone(this.valid === (this.subject === item));

  reject = (error?: Get<ErrorOrigin, T>): Promise<T> => (!this.valid ? resolve(this.subject) : reject(ofGet(error, this.subject) ?? this.results));

  recover = (f: (item: T) => T | Promise<T>): Promise<T> => resolve(!this.valid ? this.subject : f(this.subject));

  protected clone = (result = true): When<T> => new When(this.subject, result, this.results);
}

export const when = <T>(subject: T): When<T> => new When<T>(subject);
