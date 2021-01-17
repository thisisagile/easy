import { Map, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { Json, list } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';
import { Insert } from './Insert';

export class Table extends Map<Column> {
  readonly db = Database.Main;

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Column => new Column(this, name, options);

  readonly id = this.prop('id', { def: 41 });

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  insert = (fields: Json): Insert => new Insert(this, this.out(fields));
  delete = (): Delete => new Delete(this, list());
}
