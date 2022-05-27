import { isDefined, isEmpty, isTrue } from './Is';
import { validate } from '../validation';
import { Construct, Constructor, ofConstruct } from './Constructor';
import { Validatable } from './Validatable';
import { Get, ofGet } from './Get';
import { Func } from './Func';

abstract class Try<T = unknown> implements Validatable {
  is = {
    defined: (prop?: Func<unknown, T>): Try<T> => this.filter(v => isDefined(prop ? prop(v) : v)),
    empty: (prop?: Func<unknown, T>): Try<T> => this.filter(v => isEmpty(prop ? prop(v) : v)),
    valid: (prop?: Func<unknown, T>): Try<T> => this.filter(v => validate(prop ? prop(v) : v).isValid),
    true: (prop?: Func<unknown, T>): Try<T> => this.filter(v => isTrue(prop ? prop(v) : v)),
    false: (prop?: Func<unknown, T>): Try<T> => this.filter(v => !isTrue(prop ? prop(v) : v)),
    not: {
      defined: (prop?: Func<unknown, T>): Try<T> => this.filter(v => !isDefined(prop ? prop(v) : v)),
      empty: (prop?: Func<unknown, T>): Try<T> => this.filter(v => !isEmpty(prop ? prop(v) : v)),
      valid: (prop?: Func<unknown, T>): Try<T> => this.filter(v => !validate(prop ? prop(v) : v).isValid),
    },
  };

  if = this.is;

  abstract get value(): T;

  abstract get error(): Error;

  abstract get isValid(): boolean;

  static of = <T>(c: Get<T | Try<T>>, ...args: unknown[]): Try<T> => {
    try {
      const out = ofGet(c, ...args);
      return new Success(out instanceof Try ? out.value : out);
    } catch (e) {
      return new Failure(e as Error);
    }
  };

  abstract map<U>(f: Func<U | Try<U>, T>): Try<U>;

  abstract recover(f: Func<T | Try<T>, Error>): Try<T>;

  abstract recoverFrom(type: Constructor<Error>, f: Func<T | Try<T>, Error>): Try<T>;

  abstract accept(f: Func<void, T>): Try<T>;

  abstract filter(predicate: Func<boolean, T>): Try<T>;

  abstract or(value: Get<T>): T;

  abstract orElse(value?: Get<T>): T | undefined;

  abstract orThrow(error: Construct<Error>): T;
}

class Success<T> extends Try<T> {
  constructor(readonly value: T) {
    super();
  }

  get error(): Error {
    throw new Error('No error found');
  }

  get isValid(): boolean {
    return true;
  }

  map<U>(f: Func<U | Try<U>, T>): Try<U> {
    return tryTo<U>(f, this.value);
  }

  recover(f: Func<T | Try<T>, Error>): Try<T> {
    return this;
  }

  recoverFrom(type: Constructor<Error>, f: Func<T | Try<T>, Error>): Try<T> {
    return this;
  }

  accept(f: Func<void, T>): Try<T> {
    return tryTo(() => {
      f(this.value);
      return this;
    });
  }

  filter(predicate: Func<boolean, T>): Try<T> {
    return tryTo(() => {
      if (predicate(this.value)) return this;
      throw new Error(`Applying filter(${predicate.toString()}) failed.`);
    });
  }

  or(value: Get<T>): T {
    return this.value;
  }

  orElse(value?: Get<T>): T | undefined {
    return this.value;
  }

  orThrow(_error: Construct<Error>): T {
    return this.value;
  }
}

class Failure<T> extends Try<T> {
  constructor(readonly error: Error) {
    super();
  }

  get value(): T {
    throw this.error;
  }

  get isValid(): boolean {
    return false;
  }

  map<U>(f: Func<U | Try<U>, T>): Try<U> {
    return new Failure<U>(this.error);
  }

  recover<U>(f: Func<U | Try<U>, Error>): Try<U> {
    return tryTo<U>(f, this.error);
  }

  recoverFrom<U>(type: Constructor<Error>, f: Func<T | Try<T>, Error>): Try<T> {
    return tryTo(() => (this.error instanceof type ? this.recover(f) : this));
  }

  accept(f: Func<void, T>): Try<T> {
    return this;
  }

  filter(predicate: Func<boolean, T>): Try<T> {
    return this;
  }

  or(value: Get<T>): T {
    return ofGet(value);
  }

  orElse(value?: Get<T>): T | undefined {
    return ofGet(value);
  }

  orThrow(error: Construct<Error>): T {
    throw ofConstruct(error);
  }
}

export const tryTo = <T>(c: Get<T | Try<T>>, ...args: unknown[]) => Try.of<T>(c, ...args);
