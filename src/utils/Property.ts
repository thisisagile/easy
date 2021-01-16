import { convert, Convert } from './Convert';
import { isA } from '../types';

export type PropertyOptions<T = unknown> = { def?: T; convert?: Convert<T>; format?: string };
export type Property<T = unknown> = { owner: unknown; name: string; options?: PropertyOptions };

export const isProperty = (p: unknown): p is Property => isA<Property>(p, 'owner', 'name', 'options');
export const toProperty = <T>(owner: unknown, name: string, options?: PropertyOptions<T>): Property<T> => ({
  owner,
  name,
  options: { def: options?.def, convert: options?.convert ?? convert.default },
});
