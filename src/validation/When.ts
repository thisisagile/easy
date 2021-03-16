import { Constructor, ErrorOrigin, Exception, Get, isDefined, isEmpty, isIn, ofGet, Predicate, Results, toArray } from '../types';
import { validate } from './Validate';
import { reject, resolve } from '../utils';

export class When<W> {
  constructor(readonly subject: W, readonly valid = true, private results?: Results) {}

  get not(): When<W> {
    return this.clone(!this.valid);
  }

  get and(): When<W> {
    return this.clone(this.valid);
  }

  get isDefined(): When<W> {
    return this.clone(this.valid === isDefined(this.subject));
  }

  get isEmpty(): When<W> {
    return this.clone(this.valid === isEmpty(this.subject));
  }

  get isTrue(): When<W> {
    return this.clone(this.valid === !!this.subject);
  }

  get isValid(): When<W> {
    this.results = validate(this.subject);
    return this.clone(this.valid === this.results.isValid);
  }

  isInstance = <U>(c: Constructor<U>): When<W> => this.clone(this.valid === this.subject instanceof c);

  with = (pred: Predicate<W>): When<W> => this.clone(this.valid === ofGet(pred, this.subject));

  contains = (property: (w: W) => unknown): When<W> => this.clone(this.valid === isDefined(ofGet(property, this.subject)));

  in = (...items: W[]): When<W> => this.clone(this.valid === isIn(this.subject, toArray(...items)));

  is = (item: W): When<W> => this.clone(this.valid === (this.subject === item));

  reject = (error?: Get<ErrorOrigin, W>): Promise<NonNullable<W>> =>
    !this.valid ? resolve(this.subject as NonNullable<W>) : reject(ofGet(error, this.subject) ?? this.results ?? Exception.Unknown);

  recover = (f: (item: W) => W | Promise<W>): Promise<W> => resolve(!this.valid ? this.subject : f(this.subject));

  protected clone = (result = true): When<W> => new When(this.subject, result, this.results);
}

export const when = <T>(subject: T): When<T> => new When<T>(subject);
