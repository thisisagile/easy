import { convert, Convert } from './Convert';
import { Get, isA, Json, List, meta, ofGet } from '../types';

export type PropertyOptions<T = unknown> = { dflt?: Get<T>; convert?: Convert<any, any>; format?: string };
export type Property<T = unknown> = { owner: unknown; name: string; options?: PropertyOptions };

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'owner', 'name', 'options');

export const toProperty = <T>(owner: unknown, name: string, options?: PropertyOptions<T>): Property<T> => ({
  owner,
  name,
  options: { dflt: options?.dflt, convert: options?.convert ?? convert.default },
});

export const toProperties = <P extends Property>(owner: unknown): List<[string, P]> =>
  meta(owner)
    .entries<P>()
    .filter(([, v]) => isProperty(v));

export const clone = (subject: Json, from: string, to: string, dflt?: Get, convert: (value: unknown) => unknown = value => value): Json => {
  const target: any = { ...subject };
  target[to] = convert(subject[from] ?? ofGet(dflt));
  if (from !== to) delete target[from];
  return target;
};

export const cloneIn = (subject: Json, key: string, prop: Property): Json => {
  const target: any = { ...subject };
  target[key] = prop.options?.convert?.to(subject[prop.name] ?? ofGet(prop.options?.dflt));
  return target;
};

export const cloneOut = (subject: Json, key: string, prop: Property): Json => {
  const target: any = { ...subject };
  target[prop.name] = prop.options?.convert?.from(subject[key]);
  return target;
};
