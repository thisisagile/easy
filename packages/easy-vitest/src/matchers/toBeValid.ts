import { expect } from 'vitest';
import { MatcherResult, Validatable } from '../utils/Types';
import { isA } from '../utils/Utils';
import { match } from './Match';

export const toBeValid = (v?: unknown): MatcherResult =>
  match<Validatable>(v as Validatable)
    .undefined(s => s, 'Subject is undefined.')
    .not(s => isA<Validatable>(s, 'isValid'), 'Subject is not validatable.')
    .not(s => s.isValid, `Subject is not valid.`)
    .else(`Subject is valid`);

expect.extend({
  toBeValid,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeValid(): R;
    }
  }
}
