import { convert, Converter } from './Converter';
import { Map } from './Map';
import { isA } from '../types';

export type Column<T = unknown> = { map: Map; name: string; default?: T; converter?: Converter };
export const isColumn = (p: unknown): p is Column => isA<Column>(p, 'map', 'name', 'converter');

export const col = <T>(map: Map, name: string, options?: { default?: T; converter?: Converter }): Column<T> => ({
  map,
  name,
  default: options?.default,
  converter: options?.converter ?? convert.default,
});
