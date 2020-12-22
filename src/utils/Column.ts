import { convert, Converter } from './Converter';
import { isA } from '../types';

export type Column<T = unknown> = { name: string; default?: T; converter?: Converter<any, T> };
export const isColumn = (p: unknown): p is Column => isA<Column>(p, 'name', 'converter');

export const col = <T>(name: string, options?: { default?: T; converter?: Converter<T> }): Column<T> => ({
  name,
  default: options?.default,
  converter: options?.converter ?? convert.default,
});
