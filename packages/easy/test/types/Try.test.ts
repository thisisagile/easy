import '@thisisagile/easy-test';
import { Construct, ofConstruct, Predicate, asString, isDefined, isEmpty, validate, Get, ofGet } from '../../src';
import { Dev } from '../ref';
import { Constructor } from '@thisisagile/easy-test/dist/utils/Types';

abstract class Try<T = unknown> {

  is = {
    defined: (): Try<T> => this.filter(v => isDefined(v)),
    empty: (): Try<T> => this.filter(v => isEmpty(v)),
    valid: (): Try<T> => this.filter(v => validate(v).isValid),
    not: {
      defined: (): Try<T> => this.filter(v => !isDefined(v)),
      empty: (): Try<T> => this.filter(v => !isEmpty(v)),
      valid: (): Try<T> => this.filter(v => !validate(v).isValid),
    }
  };

  abstract get value(): T;

  abstract get error(): Error;

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

  abstract orElse(value: T): T;
  abstract orThrow(error: Construct<Error>): T;
}

class Success<T> extends Try<T> {

  constructor(readonly value: T) {
    super();
  }

  get error(): Error {
    throw new Error('No error found');
  }

  map<U>(f: Get<U | Try<U>, T>): Try<U> {
    return toTry<U>(() => ofGet(f, this.value));
  };

  recover(f: Get<T | Try<T>, Error>): Try<T> {
    return this;
  }

  recoverFrom(type: Constructor<Error>, f: Get<T | Try<T>, Error>): Try<T> {
    return this;
  }

  accept(f: Get<void, T>): Try<T> {
    return toTry(() => { ofGet(f, this.value); return this; });
  }

  filter(predicate: Predicate<T>): Try<T> {
    try {
      return ofGet(predicate, this.value)
        ? this
        : new Failure<T>(new Error(`Applying filter(${predicate.toString()}) failed.`));
    } catch (e) {
      return new Failure<T>(e as Error);
    }
  }

  orElse(value: T): T {
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

  map<U>(f: Get<U | Try<U>, T>): Try<U> {
    return new Failure<U>(this.error);
  };

  recover<U>(f: Get<U | Try<U>, Error>): Try<U> {
    return toTry<U>(f);
  }

  recoverFrom<U>(type: Constructor<Error>, f: Get<T | Try<T>, Error>): Try<T> {
    try {
      return this.error instanceof type ? this.recover(f) : this;
    } catch (e) {
      return new Failure<T>(this.error);
    }
  }

  accept(f: Get<void, T>): Try<T> {
    return this;
  }

  filter(predicate: Predicate<T>): Try<T> {
    return this;
  }

  orElse(value: T): T {
    return value;
  }

  orThrow(error: Construct<Error>): T {
    throw ofConstruct(error);
  }
}

const toTry = <T>(c: Construct<T | Try<T>>, ...args: unknown[]) => Try.of<T>(c, ...args);

describe('Try', () => {

  class ConstructError {
    constructor() {
      throw new Error('Error during construction');
    }
  }

  const devToId = (d: Dev): string => asString(d.id);

  const successes = [Dev, Dev.Sander, () => Dev.Jeroen, toTry(Dev), toTry(Dev.Rob), toTry(() => Dev.Jeroen)];
  const valids = [Dev.Sander, () => Dev.Jeroen, toTry(Dev.Rob), toTry(() => Dev.Jeroen)];

  const devToError = (d: Dev): Dev => {
    throw new Error(`Dev ${d} goes wrong`);
  };

  const divByZero = (n = 0) => {
    throw new Error(`Divide ${n} by zero`);
  };
  const errors = [ConstructError, toTry(ConstructError), divByZero, toTry(divByZero), toTry(() => divByZero(3))];

  // toTry

  test.each(successes)('of success', (s) => {
    expect(toTry(s)).toBeInstanceOf(Success);
  });

  test.each(errors)('of error', (s) => {
    expect(toTry(s)).toBeInstanceOf(Failure);
  });

  // value

  test.each(successes)('value success', (s) => {
    expect(toTry(s).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('value error', (s) => {
    expect(() => toTry(s).value).toThrow();
  });

  // map

  test.each(successes)('map success to success', (s) => {
    expect(toTry(s).map(d => devToId(d))).toBeInstanceOf(Success);
  });

  test.each(successes)('map success to success value is a string', (s) => {
    expect(typeof toTry(s).map(d => devToId(d)).value).toBe('string');
  });

  test.each(successes)('map success to failure should fail', (s) => {
    expect(toTry(s).map(d => devToError(d))).toBeInstanceOf(Failure);
  });

  test.each(errors)('map error', (s) => {
    expect(toTry(s).map(e => e)).toBeInstanceOf(Failure);
  });

  // accept

  test.each(successes)('accept success to keep original value', (s) => {
    expect(toTry(s).accept(d => devToId(d)).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('accept failure to return failure', (s) => {
    expect(toTry(s).accept(d => devToError(d))).toBeInstanceOf(Failure);
  });

  test.each(errors)('accept errors to remain failures', (s) => {
    expect(toTry(s).accept(e => e)).toBeInstanceOf(Failure);
  });

  // recover

  test.each(successes)('recover success to keep original value', (s) => {
    expect(toTry(s).recover(() => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from error to return valid', (s) => {
    expect(toTry(s).map(d => devToError(d)).recover(() => Dev.Wouter).value).toBe(Dev.Wouter);
  });

  // recoverFrom

  class NotValidError extends Error {}

  const devToNotValidError = (d: Dev): Dev => {
    throw new NotValidError(`Dev ${d} goes wrong`);
  };
  test.each(successes)('recover from with success to keep original value', (s) => {
    expect(toTry(s).recoverFrom(NotValidError, () => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from with different error to recover', (s) => {
    expect(toTry(s).map(d => devToError(d)).recoverFrom(NotValidError, () => Dev.Wouter).recover(() => Dev.Sander).value).toBe(Dev.Sander);
  });

  test.each(successes)('recover from with specific error to recover', (s) => {
    expect(toTry(s).map(d => devToNotValidError(d)).recoverFrom(NotValidError, () => Dev.Wouter).recover(() => Dev.Sander).value).toBe(Dev.Wouter);
  });

  // filter

  test.each(successes)('filter is successes is true returns original value', (s) => {
    expect(toTry(s).filter(() => true).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('filter on successes is false returns failure', (s) => {
    expect(toTry(s).filter(() => false)).toBeInstanceOf(Failure);
  });

  test.each(errors)('filter on errors returns failure', (s) => {
    expect(toTry(s).filter(() => true)).toBeInstanceOf(Failure);
  });

  // is

  test.each(successes)('is defined on successes returns original value', (s) => {
    expect(toTry(s).is.defined().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is defined on failure returns failure', (s) => {
    expect(toTry(s).is.defined()).toBeInstanceOf(Failure);
  });

  test.each(successes)('is empty on successes returns original value', (s) => {
    expect(toTry(s).is.empty()).toBeInstanceOf(Failure);
  });

  test.each(errors)('is empty on failure returns failure', (s) => {
    expect(toTry(s).is.empty()).toBeInstanceOf(Failure);
  });

  test.each(valids)('is valid on successes returns original value', (s) => {
    expect(toTry(s).is.valid().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is valid on failure returns failure', (s) => {
    expect(toTry(s).is.valid()).toBeInstanceOf(Failure);
  });

  // is.not

  test.each(successes)('is not defined on successes returns original value', (s) => {
    expect(toTry(s).is.not.defined()).toBeInstanceOf(Failure);
  });

  test.each(errors)('is not defined on failure returns failure', (s) => {
    expect(toTry(s).is.not.defined()).toBeInstanceOf(Failure);
  });

  test.each(successes)('is not empty on successes returns original value', (s) => {
    expect(toTry(s).is.not.empty().value).toBeInstanceOf(Dev);
  });

  test.each(errors)('is not empty on failure returns failure', (s) => {
    expect(toTry(s).is.not.empty()).toBeInstanceOf(Failure);
  });

  test.each(valids)('is not valid on successes returns original value', (s) => {
    expect(toTry(s).is.not.valid()).toBeInstanceOf(Failure);
  });

  test.each(errors)('is not valid on failure returns failure', (s) => {
    expect(toTry(s).is.not.valid()).toBeInstanceOf(Failure);
  });

  // orElse

  test.each(successes)('or else with successes returns original value', (s) => {
    expect(toTry(s).orElse(Dev.Wouter)).not.toBe(Dev.Wouter);
  });

  test.each(successes)('or else with successes returns original value', (s) => {
    expect(toTry(s).filter(() => false).orElse(Dev.Wouter)).toBe(Dev.Wouter);
  });

  // orThrow

  test.each(successes)('or throw with successes returns original value', (s) => {
    expect(toTry(s).orThrow(NotValidError)).toBeInstanceOf(Dev);
  });

  test.each(successes)('or throw with failure to throw specific error', (s) => {
    expect(() => toTry(s).filter(() => false).orThrow(() => new NotValidError('Bummer'))).toThrow(NotValidError);
  });
});

