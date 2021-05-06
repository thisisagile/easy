import { Column } from './Column';
import { MapOptions, Mapper, mappings, PropertyOptions } from '../utils';
import { Database } from '../data';
import { Json, toList, toUuid } from '../types';
import { Select } from './Select';
import { Insert } from './Insert';
import { Update } from './Update';
import { Delete } from './Delete';
import { Join } from './Join';
import { Count } from './Count';

export class Table extends Mapper {
  protected readonly map = {
    ...mappings,
    column: <T = unknown>(name: string, options?: PropertyOptions<T>): Column => new Column(this, name, options),
  };

  readonly id = this.map.column('', { dflt: toUuid });

  constructor(readonly db: Database = Database.Default, options: MapOptions = { startFrom: 'source' }) {
    super(options);
  }

  get count(): Count {
    return new Count(this);
  }

  /**
   * @deprecated Deprecated since version 6.2. Please use map.column instead.
   */
  prop = <T = unknown>(name: string, options?: PropertyOptions<T>): Column => this.map.column(name, options);

  select = (...columns: Column[]): Select => new Select(this, toList(columns));

  insert = (fields: Json): Insert => new Insert(this, this.out(fields));
  update = (fields: Json): Update => new Update(this, this.out(fields));
  delete = (): Delete => new Delete(this, toList());

  readonly join = (t: Table): Join => new Join(this, t);
}
