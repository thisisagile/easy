import { expect } from 'vitest';
import { Constructor as Ctor, MatcherResult } from '../utils/Types';
import { match } from './Match';

export const toBeArrayOfWithLength = <T>(items: unknown, ctor: Ctor<T>, length: number): MatcherResult =>
  match<unknown>(items)
    .undefined(it => it, 'Subject is undefined.')
    .not(it => it instanceof Array, 'Subject is not an array.')
    .not(
      it => (it as []).length === length,
      it => `Subject does not have ${length} elements, but ${(it as []).length}.`
    )
    .not(it => (it as []).every((i: any) => i instanceof ctor), `Not all elements are of type '${ctor.name}'.`)
    .else(`Subject has ${length} elements, which are all of type '${ctor.name}'`);

expect.extend({
  toBeArrayOfWithLength,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeArrayOfWithLength<Z>(ctor: Ctor<Z>, length: number): R;
    }
  }
}
