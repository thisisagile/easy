import { convert, Convert } from './Convert';
import { Get, isA, isDefined, Json, List, meta, ofGet } from '../types';

export type PropertyOptions<T = unknown> = { def?: Get<T>; convert?: Convert<T>; format?: string };
export type Property<T = unknown> = { owner: unknown; name: string; options?: PropertyOptions };

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'owner', 'name', 'options');

export const toProperty = <T>(owner: unknown, name: string, options?: PropertyOptions<T>): Property<T> => ({
  owner,
  name,
  options: { def: options?.def, convert: options?.convert ?? convert.default },
});

export const toProperties = <P extends Property>(owner: unknown): List<[string, P]> =>
  meta(owner)
    .entries<P>()
    .filter(([, v]) => isProperty(v));

export const clone = (subject: Json, from: string, to: string, def: unknown, convert: (value: unknown) => unknown): Json => {
  if (from === to) return subject;
  const value = subject[to] ?? ofGet(def);
  if (isDefined(value)) (subject as any)[from] = convert(value);
  delete subject[to];
  return subject;
};
