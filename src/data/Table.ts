import { Property, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { list, List, meta } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';

export class Table {
  readonly db = Database.Main;

  get columns(): List<[string, Property]> {
    return meta(this)
      .entries<Property>()
      .filter(([, v]) => v instanceof Column);
  }

  col = (name: string, options?: PropertyOptions): Column => new Column(this, name, options);

  readonly id = this.col('id');

  toString(): string {
    return this.constructor.name;
  }

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  delete = (): Delete => new Delete(this, list());
}
