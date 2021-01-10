import { Column, ColumnOptions } from '../utils';
import { Database } from '../data';
import { SqlColumn } from './SqlColumn';
import { List, meta } from '../types';

export class Table {
  readonly db = Database.Main;

  get columns(): List<[string, Column]> {
    return meta(this)
      .entries<Column>()
      .filter(([, v]) => v instanceof SqlColumn);
  }

  col = <T = unknown>(name: string, options?: ColumnOptions): SqlColumn<T> => new SqlColumn<T>(this, name, options);

  readonly id = this.col('id');

  toString(): string {
    return this.constructor.name;
  }
}
