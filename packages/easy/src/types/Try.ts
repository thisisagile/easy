import { isDefined, isEmpty, isTrue } from './Is';
import { validate } from '../validation';
import { Construct, Constructor, ofConstruct } from './Constructor';
import { Validatable } from './Validatable';
import { Get, ofGet, Predicate } from './Get';

abstract class Try<T = unknown> implements Validatable {

  is = {
    defined: (): Try<T> => this.filter(v => isDefined(v)),
    empty: (): Try<T> => this.filter(v => isEmpty(v)),
    valid: (): Try<T> => this.filter(v => validate(v).isValid),
    true: (): Try<T> => this.filter(v => isTrue(v)),
    false: (): Try<T> => this.filter(v => !isTrue(v)),
    not: {
      defined: (): Try<T> => this.filter(v => !isDefined(v)),
      empty: (): Try<T> => this.filter(v => !isEmpty(v)),
      valid: (): Try<T> => this.filter(v => !validate(v).isValid),
    },
  };

  abstract get value(): T;

  abstract get error(): Error;

  abstract get isValid(): boolean;

  static of = <T>(c: Construct<T | Try<T>>, ...args: unknown[]): Try<T> => {
    try {
      const out = ofConstruct(c, ...args);
      return new Success(out instanceof Try ? out.value : out);
    } catch (e) {
      return new Failure(e as Error);
    }
  };

  abstract map<U>(f: Get<U | Try<U>, T>): Try<U>;

  abstract recover(f: Get<T | Try<T>, Error>): Try<T>;

  abstract recoverFrom(type: Constructor<Error>, f: Get<T | Try<T>, Error>): Try<T>;

  abstract accept(f: Get<void, T>): Try<T>;

  abstract filter(predicate: Predicate<T>): Try<T>;

  abstract orElse(value?: T): T | undefined;

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
  };

  map<U>(f: Get<U | Try<U>, T>): Try<U> {
    return tryTo<U>(f, this.value);
  };

  recover(f: Get<T | Try<T>, Error>): Try<T> {
    return this;
  }

  recoverFrom(type: Constructor<Error>, f: Get<T | Try<T>, Error>): Try<T> {
    return this;
  }

  accept(f: Get<void, T>): Try<T> {
    return tryTo(() => {
      ofGet(f, this.value);
      return this;
    });
  }

  filter(predicate: Predicate<T>): Try<T> {
    return tryTo(() => {
      if (ofGet(predicate, this.value)) return this;
      throw new Error(`Applying filter(${predicate.toString()}) failed.`);
    });
  }

  orElse(value?: T): T | undefined {
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
  };

  map<U>(f: Get<U | Try<U>, T>): Try<U> {
    return new Failure<U>(this.error);
  };

  recover<U>(f: Get<U | Try<U>, Error>): Try<U> {
    return tryTo<U>(f, this.error);
  }

  recoverFrom<U>(type: Constructor<Error>, f: Get<T | Try<T>, Error>): Try<T> {
    return tryTo(() => this.error instanceof type ? this.recover(f) : this);
  }

  accept(f: Get<void, T>): Try<T> {
    return this;
  }

  filter(predicate: Predicate<T>): Try<T> {
    return this;
  }

  orElse(value?: T): T | undefined {
    return value;
  }

  orThrow(error: Construct<Error>): T {
    throw ofConstruct(error);
  }
}

export const tryTo = <T>(c: Construct<T | Try<T>>, ...args: unknown[]) => Try.of<T>(c, ...args);
