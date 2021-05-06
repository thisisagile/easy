import { isArray, isDefined } from './Is';

export type ArrayLike<T> = (T | T[])[];

export const toArray = <T>(...items: ArrayLike<T>): T[] =>
  items.length > 1 ? (items as T[]) : isArray(items[0]) ? items[0] : isDefined(items[0]) ? [items[0]] : [];
