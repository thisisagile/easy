import { Column } from './Column';
import { Map, MapOptions, PropertyOptions } from '../utils';
import { Database } from '../data';
import { Json, toList, toUuid } from '../types';
import { Select } from './Select';
import { Insert } from './Insert';
import { Update } from './Update';
import { Delete } from './Delete';
import { Join } from './Join';
import { Count } from './Count';

export class Table extends Map<Column> {
  constructor(readonly db: Database = Database.Default, options: MapOptions = {startFrom: 'source'}) {
    super(options);
  }

  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Column => new Column(this, name, options);

  readonly id = this.prop('id', { dflt: toUuid });

  select = (...columns: Column[]): Select => new Select(this, toList(columns));
  get count(): Count {
    return new Count(this);
  }
  insert = (fields: Json): Insert => new Insert(this, this.out(fields));
  update = (fields: Json): Update => new Update(this, this.out(fields));
  delete = (): Delete => new Delete(this, toList());

  readonly join = (t: Table): Join => new Join(this, t);
}
