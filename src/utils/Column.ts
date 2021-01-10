import { convert, Convert } from './Convert';
import { Map } from './Map';
import { isA } from '../types';

export type ColumnOptions<T = unknown> = { def?: T; convert?: Convert<T> };
export type Column<T = unknown> = { map: Map; name: string; options?: ColumnOptions };

export const isColumn = (p: unknown): p is Column => isA<Column>(p, 'map', 'name', 'options');

export const col = <T>(map: Map, name: string, options?: ColumnOptions<T>): Column<T> => ({
  map,
  name,
  options: { def: options?.def, convert: options?.convert ?? convert.default },
});
