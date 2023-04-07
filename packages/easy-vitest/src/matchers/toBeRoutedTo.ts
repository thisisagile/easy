import { match } from './Match';
import { MatcherResult, Uri } from '../utils/Types';
import { asString } from '../utils/Utils';
import { expect, Mock } from 'vitest';

export const toBeRoutedTo = (query: Mock, expected: Uri): MatcherResult =>
  match<any[]>(query?.mock?.calls)
    .undefined(c => c, 'Uri is unknown.')
    .not(c => c.length === 1, 'Method was not called.')
    .not(
      c => asString(c[0][0]) === asString(expected),
      c => `We expected uri '${asString(expected)}', but we received uri '${asString(c[0][0])}' instead.`
    )
    .else(`Called uri does match '${asString(expected)}'`);

expect.extend({
  toBeRoutedTo: toBeRoutedTo,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toBeRoutedTo(uri: Uri): R;
    }
  }
}
