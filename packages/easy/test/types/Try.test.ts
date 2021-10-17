import '@thisisagile/easy-test';
import { Construct, ofConstruct } from '../../src';
import { Dev } from '../ref';


abstract class Try<T = unknown> {
  protected constructor(protected readonly val?: T) {
  }

  get value(): T | undefined {
    return this.val;
  }

  static of = <T>(c: Construct<T | Try<T>>): Try<T> => {
    try {
      const out = ofConstruct(c);
      return new Success(out instanceof Try ? out.value : out);
    } catch (e) {
      return new Failure(e as Error);
    }
  };
}

class Success<T> extends Try<T> {
}

class Failure<E = Error> extends Try<E> {
  constructor(readonly error: Error) {
    super();
  }

  get value(): E | undefined {
    throw this.error;
  }
}

const toTry = <T>(c: Construct<T>) => Try.of<T>(c);

describe('Try', () => {

  class ConstructError {
    constructor() {
      throw new Error('Error during construction');
    }
  }

  const successes = [Dev, Dev.Sander, () => Dev.Jeroen, toTry(Dev), toTry(Dev.Rob), toTry(() => Dev.Jeroen)];

  const divByZero = (n = 0) => {
    throw new Error(`Divide ${n} by zero`);
  }
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
});
