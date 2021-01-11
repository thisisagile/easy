import { convert, Convert } from './Convert';
import { Map } from './Map';
import { isA } from '../types';

export type PropertyOptions<T = unknown> = { def?: T; convert?: Convert<T> };
export type Property<T = unknown> = { map: Map; name: string; options?: PropertyOptions };

export const isColumn = (p: unknown): p is Property => isA<Property>(p, 'map', 'name', 'options');

export const col = <T>(map: Map, name: string, options?: PropertyOptions<T>): Property<T> => ({
  map,
  name,
  options: { def: options?.def, convert: options?.convert ?? convert.default },
});
