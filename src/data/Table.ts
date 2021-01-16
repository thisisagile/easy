import { Map, PropertyOptions } from '../utils';
import { Database } from './index';
import { Column } from './Column';
import { list, List, meta } from '../types';
import { Select } from './Select';
import { Delete } from './Delete';

export class Table extends Map {
  readonly db = Database.Main;

  get columns(): List<[string, Column]> {
    return meta(this)
      .entries<Column>()
      .filter(([, v]) => v instanceof Column);
  }

  prop = (name: string, options?: PropertyOptions): Column => new Column(this, name, options);

  readonly id = this.prop('id');

  select = (...columns: Column[]): Select => new Select(this, list(columns));
  delete = (): Delete => new Delete(this, list());
}
