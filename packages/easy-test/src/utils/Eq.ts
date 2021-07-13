import { equals } from 'expect/build/jasmineUtils';
import { iterableEquality, subsetEquality } from 'expect/build/utils';
import { asString } from './Utils';

export const eq = {
  exact: (a?: unknown, b?: unknown): boolean => equals(a, b, []),
  subset: (a?: unknown, b?: unknown): boolean => equals(a, b, [iterableEquality, subsetEquality]),
  string: (a?: unknown, b?: unknown): boolean => asString(a) === asString(b),
};
