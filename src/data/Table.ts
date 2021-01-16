import { Map, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { list } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';

export class Table extends Map<Column> {
  readonly db = Database.Main;

  prop = (name: string, options?: PropertyOptions): Column => new Column(this, name, options);

  readonly id = this.prop('id');

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  delete = (): Delete => new Delete(this, list());
}
