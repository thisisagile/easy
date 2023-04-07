import { expect } from 'vitest';
import { Exception, MatcherResult } from '../utils/Types';
import { match } from './Match';
import { isDefined } from '../utils/Utils';

export const toMatchException = (received: Exception, expected: unknown, reason?: string): MatcherResult =>
  match<Exception>(expected as Exception)
    .undefined(e => e.id, 'Expected value is not an exception.')
    .not(
      e => e.id === received.id,
      e => `Expected exception has id '${e.id}', while the received exception has id '${received.id}'.`
    )
    .not(
      () => !isDefined(reason) || (isDefined(reason) && isDefined(received.reason)),
      () => `We expected to have reason '${reason}', but we received no reason.`
    )
    .not(
      () => !isDefined(reason) || (isDefined(reason) && received.reason === reason),
      () => `We expected to have reason '${reason}', but we received reason '${received.reason}'.`
    )
    .else(`Expected exception matches received exception`);

expect.extend({
  toMatchException,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchException(exception: unknown, reason?: string): R;
    }
  }
}
