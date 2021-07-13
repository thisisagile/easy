import CustomMatcherResult = jest.CustomMatcherResult;
import { match } from './Match';
import { Results } from '../utils/Types';

// Tests for handling Results.

const notDefined = 'Results is not defined.';
const doesNotFail = 'Results does not fail.';

const hasMessage = (res: Results, message: string) => res.results.some((r: any) => r.message === message);

const messages = (res: Results): string => "'" + res?.results.map(r => r.message).join("', '") + "'";

export const toResultWith = (results: Results, message: string): CustomMatcherResult =>
  match(results)
    .undefined(r => r, notDefined)
    .not(
      r => hasMessage(r, message),
      r => `Results does not have message '${message}', but it has messages ${messages(r)} instead.`
    )
    .else(`Succeeds with message ${message}`);

export const toFail = (results: Results): CustomMatcherResult =>
  match(results)
    .undefined(r => r, notDefined)
    .not(r => !r.isValid, doesNotFail)
    .else('Results does not fail');

export const toFailWith = (results: Results, message: string): CustomMatcherResult =>
  match(results)
    .undefined(r => r, notDefined)
    .not(r => !r.isValid, doesNotFail)
    .not(
      r => hasMessage(r, message),
      r => `Fails, but results does not have message '${message}', but it has messages ${messages(r)} instead.`
    )
    .else(`Fails with message '${message}'`);

expect.extend({
  toResultWith,
  toFail: toFail,
  toFailWith: toFailWith,
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toResultWith(message: string): R;
      toFail(): R;
      toFailWith(message: string): R;
    }
  }
}
