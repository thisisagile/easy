import CustomMatcherResult = jest.CustomMatcherResult;
import { isValidatable } from '../types';

export const toBeValid = (v: unknown): CustomMatcherResult =>
  ({
    pass: isValidatable(v) && v.isValid,
    message: () => isValidatable(v) && v.isValid ? "Target is valid" : "Target is not valid" });

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
