import { asString } from './Utils';
import { equals, iterableEquality, subsetEquality } from '@jest/expect-utils';

export const eq = {
  exact: (a?: unknown, b?: unknown): boolean => equals(a, b, []),
  subset: (a?: unknown, b?: unknown): boolean => equals(a, b, [iterableEquality, subsetEquality]),
  string: (a?: unknown, b?: unknown): boolean => asString(a) === asString(b),
};
