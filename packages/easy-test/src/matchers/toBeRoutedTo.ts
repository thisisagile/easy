import { checkDefined } from './Check';
import { Uri } from '../utils/Types';
import { asString } from '../utils/Utils';
import { match } from './Match';

export const weExpectedButReceivedInstead = ([r, e]: [any, any]) => `We expected ${asString(e)}, but we received '${asString(r)}' instead.`;

export function toMatchAsString(this: jest.MatcherContext, received: unknown, expected: unknown): jest.CustomMatcherResult {
  return checkDefined(this, received, expected)
    .not(
      ([r, e]) => this.equals(asString(r), asString(e)),
      ([r, e]) => weExpectedButReceivedInstead([r, e])
    )
    .else();
}

// export function toBeRoutedTo(this: jest.MatcherContext, query: jest.Mock, expected: Uri): jest.CustomMatcherResult {
//   return check<any[]>(this, query?.mock?.calls)
//     .undefined(r => r, "Uri is unknown.")
//     .not(r => r.length === 1, "Method was not called.")
//     .not(r => this.equals(asString(r[0][0]), asString(expected)), ([r,e]) => weExpectedButReceivedInstead([r[0][0], e]))
//     .else();
// }

export const toBeRoutedTo = (query: jest.Mock, expected: Uri): jest.CustomMatcherResult =>
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
