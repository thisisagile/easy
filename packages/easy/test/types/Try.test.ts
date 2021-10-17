import '@thisisagile/easy-test';
import { Construct, ofConstruct } from '../../src';
import { Dev } from '../ref';


class Try<T = unknown> {
  private constructor(public value?: T) {
  }

  static of = <T>(c: Construct<T>): Try<T> => {
    try {
      return new Try(ofConstruct(c));
    }
    catch {
      return new Try();
    }
  }
}

const toTry = <T>(c: Construct<T>) => Try.of<T>(c);

describe('Try', () => {

  const successes = [Dev, Dev.Sander, () => Dev.Jeroen];
  const errors = [Error, new Error('Sorry'), () => new Error('Sorry again'), (n = 0) => {throw new Error(`Divide ${n} by zero`);}];

  test.each(successes)('of', (s) => {
    expect(toTry(s)).toBeInstanceOf(Try);
  });

  test.each(errors)('of', (s) => {
    expect(toTry(s)).toBeInstanceOf(Try);
  });

  test.each(successes)('of', (s) => {
    expect(toTry(s).value).toBeInstanceOf(Dev);
  });
});
