import '@thisisagile/easy-test';
import { Construct, ofConstruct, Predicate, asString, isDefined, isEmpty, validate } from '../../src';
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

  abstract map<U>(f: (value: T) => U | Try<U>): Try<U>;
  abstract recover(f: (error: Error) => T | Try<T>): Try<T>;
  abstract recoverFrom(type: Constructor<Error>, f: (error: Error) => T | Try<T>): Try<T>;
  abstract accept(f: (value: T) => void): Try<T>;
  abstract filter(predicate: Predicate<T>): Try<T>;
}

class Success<T> extends Try<T> {

  constructor(readonly value: T) {
    super();
  }

  get error(): Error {
    throw new Error('No error found');
  }

  map<U>(f: (value: T) => U | Try<U>): Try<U> {
    return toTry<U>(() => f(this.value));
  };

  recover(f: (error: Error) => T | Try<T>): Try<T> {
    return this;
  }

  recoverFrom(type: Constructor<Error>, f: (error: Error) => T | Try<T>): Try<T> {
    return this;
  }

  accept(f: (value: T) => void): Try<T> {
    try {
      f(this.value);
      return this;
    } catch (e) {
      return new Failure<T>(e as Error);
    }
  }

  filter(predicate: (value: T) => boolean): Try<T> {
    try {
      return predicate(this.value)
        ? this
        : new Failure<T>(new Error(`Applying filter(${predicate.toString()}) failed.`));
    } catch (e) {
      return new Failure<T>(e as Error);
    }
  }
}

class Failure<T> extends Try<T> {
  constructor(readonly error: Error) {
    super();
  }

  get value(): T {
    throw this.error;
  }

  map<U>(f: (value: T) => U | Try<U>): Try<U> {
    return new Failure<U>(this.error);
  };

  recover<U>(f: (error: Error) => U | Try<U>): Try<U> {
    return toTry<U>(f);
  }

  recoverFrom(type: Constructor<Error>, f: (error: Error) => T | Try<T>): Try<T> {
    try {
      return this.error instanceof type ? this.recover(f) : this;
    } catch (e) {
      return new Failure<T>(this.error);
    }
  }

  accept(f: (value: T) => void): Try<T> {
    return this;
  }

  filter(predicate: (value: T) => boolean): Try<T> {
    return this;
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

  test.each(successes)('of success', (s) => {
    expect(toTry(s)).toBeInstanceOf(Success);
  });

  test.each(errors)('of error', (s) => {
    expect(toTry(s)).toBeInstanceOf(Failure);
  });

  test.each(successes)('value success', (s) => {
    expect(toTry(s).value).toBeInstanceOf(Dev);
  });

  test.each(errors)('value error', (s) => {
    expect(() => toTry(s).value).toThrow();
  });

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

  test.each(successes)('accept success to keep original value', (s) => {
    expect(toTry(s).accept(d => devToId(d)).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('accept failure to return failure', (s) => {
    expect(toTry(s).accept(d => devToError(d))).toBeInstanceOf(Failure);
  });

  test.each(errors)('accept errors to remain failures', (s) => {
    expect(toTry(s).accept(e => e)).toBeInstanceOf(Failure);
  });

  test.each(successes)('recover success to keep original value', (s) => {
    expect(toTry(s).recover(() => Dev.Wouter).value).not.toBe(Dev.Wouter);
  });

  test.each(successes)('recover from error to return valid', (s) => {
    expect(toTry(s).map(d => devToError(d)).recover(() => Dev.Wouter).value).toBe(Dev.Wouter);
  });

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

  test.each(successes)('filter is successes is true returns original value', (s) => {
    expect(toTry(s).filter(() => true).value).toBeInstanceOf(Dev);
  });

  test.each(successes)('filter on successes is false returns failure', (s) => {
    expect(toTry(s).filter(() => false)).toBeInstanceOf(Failure);
  });

  test.each(errors)('filter on errors returns failure', (s) => {
    expect(toTry(s).filter(() => true)).toBeInstanceOf(Failure);
  });

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
});

