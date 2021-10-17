import '@thisisagile/easy-test';
import { Construct, ofConstruct } from '../../src';
import { Dev } from '../ref';


class Try<T = unknown> {
  protected constructor(protected readonly val?: T) {
  }

  get value(): T | undefined {
    return this.val;
  }

  static of = <T>(c: Construct<T>): Try<T> => {
    try {
      return new Success(ofConstruct(c));
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
}

const toTry = <T>(c: Construct<T>) => Try.of<T>(c);

describe('Try', () => {

  class ConstructError {
    constructor() {
      throw new Error('Error during construction');
    }
  }

  const successes = [Dev, Dev.Sander, () => Dev.Jeroen];
  const errors = [ConstructError, (n = 0) => {
    throw new Error(`Divide ${n} by zero`);
  }];

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
    expect(toTry(s).value).toBeUndefined();
  });
});
