import { expect } from 'vitest';
import { MatcherResult } from '../utils/Types';
import { match } from './Match';
import { eq } from '../utils/Eq';

export const MatchesExactJson = {
  SubjectUndefined: 'Subject is undefined.',
  SubsetUndefined: 'Object to match with is undefined.',
  DoesNotMatch: 'Object does not exactly match subject.',
  Yes: 'Object matches subject exactly',
};

export const toMatchExactJson = (value?: unknown, json?: unknown): MatcherResult =>
  match<unknown>(value)
    .undefined(v => v, MatchesExactJson.SubjectUndefined)
    .undefined(() => json, MatchesExactJson.SubsetUndefined)
    .not(v => eq.exact(v, json), MatchesExactJson.DoesNotMatch)
    .else(() => MatchesExactJson.Yes);

expect.extend({
  toMatchExactJson: toMatchExactJson,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchExactJson(json?: unknown): R;
    }
  }
}
