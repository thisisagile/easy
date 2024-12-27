import { List, toList } from './List';
import { ifDefined } from '../utils/If';

export type Entry<T = unknown> = [key: string, value: T];

export function entries<T = unknown>(subject: { [p: string]: T } | ArrayLike<T>): List<Entry<T>> {
  return ifDefined(
    subject,
    () => toList<Entry<T>>([...Object.entries(subject), ...Object.entries(Object.getPrototypeOf(subject))] as Entry<T>[]),
    () => toList<Entry<T>>()
  );
}

export function values<T = unknown>(subject: { [p: string]: T } | ArrayLike<T>): List<T> {
  return toList([...Object.values<T>(subject), ...Object.values<T>(Object.getPrototypeOf(subject))]);
}

export function keys<T = unknown>(subject: { [p: string]: T } | ArrayLike<T>): List<string> {
  return toList([...Object.keys(subject), ...Object.keys(Object.getPrototypeOf(subject))]);
}

export function extractKeys<T extends Record<string | number, unknown>, K extends keyof T>(
  obj: T,
  keys: K[] | readonly (keyof T)[]
): {
  keys: Pick<T, K>;
} & Omit<T, K> {
  return keys
    .filter((k): k is K => k in obj)
    .reduce(
      (acc, key) => {
        (acc.keys as T)[key] = obj[key];
        delete acc[key];
        return acc;
      },
      { keys: {} as Pick<T, K>, ...obj }
    );
}
