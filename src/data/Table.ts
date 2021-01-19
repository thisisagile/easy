import { Map, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { Json, list, toUuid } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';
import { Insert } from './Insert';
import { Update } from './Update';

export class Table extends Map<Column> {
  readonly db = Database.Main;

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Column => new Column(this, name, options);

  readonly id = this.prop('id', { def: toUuid });

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  insert = (fields: Json): Insert => new Insert(this, this.out(fields));
  update = (fields: Json): Update => new Update(this, this.out(fields));
  delete = (): Delete => new Delete(this, list());
}
