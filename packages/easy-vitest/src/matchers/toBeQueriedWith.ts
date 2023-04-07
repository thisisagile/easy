import { match } from './Match';
import { MatcherResult, Query } from '../utils/Types';
import { expect, Mock } from 'vitest';

export const toBeQueriedWith = (query: Mock, expected: Query): MatcherResult =>
  match<any[]>(query?.mock?.calls)
    .undefined(c => c, 'Query is unknown.')
    .not(c => c.length === 1, 'Query did not execute.')
    .not(
      c => c[0][0].toString() === expected?.toString(),
      c => `We expected query '${expected}', but we received query '${c[0][0]}' instead.`
    )
    .else(`Received query does match '${expected}'`);

expect.extend({
  toBeQueriedWith: toBeQueriedWith,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeQueriedWith(expected: Query): R;
    }
  }
}
