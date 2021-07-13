import { match } from './Match';
import { Message, toMessage } from '../utils/Types';
import CustomMatcherResult = jest.CustomMatcherResult;

// Handles CustomMatcherResult validations.

export const Fails = {
  Yes: 'Match fails, instead of passes.',
  No: (reason: string): string => `Match doesn't fail, because '${reason}'`,
};

export const FailsWith = {
  Yes: 'Match fails with correct message.',
  No: (message: string, instead: string): string => `Match does fail, however not with message '${message}', but with message '${instead}' instead.`,
};

export const toFailMatcher = (result: CustomMatcherResult): CustomMatcherResult =>
  match(result)
    .not(
      c => !c.pass,
      c => Fails.No(c.message())
    )
    .else(Fails.Yes);

export const toFailMatcherWith = (result: CustomMatcherResult, message: Message<CustomMatcherResult>): CustomMatcherResult =>
  match(result)
    .not(
      c => !c.pass,
      c => Fails.No(c.message())
    )
    .not(
      c => c.message().includes(toMessage(message)),
      c => FailsWith.No(toMessage(message), c.message())
    )
    .else(FailsWith.Yes);

expect.extend({
  toFailMatcher: toFailMatcher,
  toFailMatcherWith: toFailMatcherWith,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toFailMatcher(): R;

      toFailMatcherWith(message: string): R;
    }
  }
}
