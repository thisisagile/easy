import { match } from './Match';
import CustomMatcherResult = jest.CustomMatcherResult;
import { Message, toMessage } from '../utils/Types';

// Handles CustomMatcherResult validations.

export const Passes = {
  Yes: 'Match passes, instead of fails.',
  No: (reason: string): string => `Match doesn't pass, because '${reason}'`,
};

export const PassesWith = {
  Yes: 'Match passes with correct message.',
  No: (message: string, instead: string): string => `Match does pass, however not with message '${message}', but with message '${instead}' instead.`,
};

export const toPassMatcher = (result: CustomMatcherResult): CustomMatcherResult =>
  match(result)
    .not(
      c => c.pass,
      c => Passes.No(c.message())
    )
    .else(Passes.Yes);

export const toPassMatcherWith = (result: CustomMatcherResult, message: Message<CustomMatcherResult>): CustomMatcherResult =>
  match(result)
    .not(
      c => c.pass,
      c => Passes.No(c.message())
    )
    .not(
      c => c.message().includes(toMessage(message)),
      c => PassesWith.No(toMessage(message), c.message())
    )
    .else(PassesWith.Yes);

expect.extend({
  toPassMatcher: toPassMatcher,
  toPassMatcherWith: toPassMatcherWith,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toPassMatcher(): R;
      toPassMatcherWith(message: string): R;
    }
  }
}
