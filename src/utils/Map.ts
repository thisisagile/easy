import { isDefined, Json, List, meta } from '../types';
import { col as column, Column, ColumnOptions, isColumn } from './Column';

const clone = (subject: any, key: string, name: string, def: unknown, convert: (x: unknown) => unknown): Json => {
  if (key === name) return subject;
  const value = subject[name] ?? def;
  if (isDefined(value)) subject[key] = convert(value);
  delete subject[name];
  return subject;
};

export class Map {
  get columns(): List<[string, Column]> {
    return meta(this)
      .entries<Column>()
      .filter(([, v]) => isColumn(v));
  }

  col = <T = unknown>(name: string, options?: ColumnOptions<T>): Column => column(this, name, options);

  in = (from?: Json): Json => this.columns.reduce((a: any, [k, v]: [string, Column]) => clone(a, k, v.name, v.options.def, v.options.convert.to), { ...from });
  out = (to?: Json): Json => this.columns.reduce((a: any, [k, v]: [string, Column]) => clone(a, v.name, k, undefined, v.options.convert.from), { ...to });
}
