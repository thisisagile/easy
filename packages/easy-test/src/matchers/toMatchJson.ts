import CustomMatcherResult = jest.CustomMatcherResult;
import { match } from './Match';
import { eq } from '../utils/Eq';
import { asJson } from '../utils/Utils';

export const MatchesJson = {
  SubjectUndefined: 'Subject is undefined.',
  SubsetUndefined: 'Subset to match with is undefined.',
  DoesNotMatch: 'Subset does not match subject.',
  Yes: 'Subset matches subject',
};

export const toMatchJson = (value?: unknown, subset?: unknown): CustomMatcherResult =>
  match<unknown>(value)
    .undefined(v => v, MatchesJson.SubjectUndefined)
    .undefined(() => subset, MatchesJson.SubsetUndefined)
    .not(v => eq.subset(asJson(v), asJson(subset)), MatchesJson.DoesNotMatch)
    .else(() => MatchesJson.Yes);

expect.extend({
  toMatchJson: toMatchJson,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchJson(subset?: unknown): R;
    }
  }
}
