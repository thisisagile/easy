import { clone, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { Json, list, List, meta } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';

export class Table {
  readonly db = Database.Main;

  get columns(): List<[string, Column]> {
    return meta(this)
      .entries<Column>()
      .filter(([, v]) => v instanceof Column);
  }

  col = (name: string, options?: PropertyOptions): Column => new Column(this, name, options);

  readonly id = this.col('id');

  in = (from?: Json): Json => this.columns.reduce((a: any, [k, v]: [string, Column]) => clone(a, k, v.name, v.options.def, v.options.convert.to), { ...from });

  out = (to?: Json): Json => this.columns.reduce((a: any, [k, v]: [string, Column]) => clone(a, v.name, k, undefined, v.options.convert.from), { ...to });

  toString(): string {
    return this.constructor.name;
  }

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  delete = (): Delete => new Delete(this, list());
}
