import { Gateway, Id, isDefined, Json, Optional, PageList, PageOptions, toPageList } from '../types';
import { QueryProvider } from '../data';
import { when } from '../validation';
import { ifDefined } from '../utils';
import { Table } from './Table';

export type TableOptions = PageOptions & { provider?: QueryProvider };

export class TableGateway<T extends Table> extends Gateway<PageOptions> {
  constructor(readonly table: T, readonly provider = table.db.provide<QueryProvider>()) {
    super();
  }

  protected provide = ({ provider }: TableOptions = {}): QueryProvider => provider ?? this.provider;

  all(options?: TableOptions): Promise<PageList<Json>> {
    return this.provide(options)
      .query(this.table.select())
      .then(js =>
        toPageList(
          js.map(j => this.table.in(j)),
          options
        )
      );
  }

  byId(id: Id, options?: TableOptions): Promise<Optional<Json>> {
    return this.provide(options)
      .query(this.table.select().where(this.table.id.is(id)))
      .then(js => js.first())
      .then(j => ifDefined(j, this.table.in(j)));
  }

  exists(id: Id, options?: TableOptions): Promise<boolean> {
    return this.byId(id).then(j => isDefined(j));
  }

  add(item: Json, options?: TableOptions): Promise<Json> {
    return this.provide(options)
      .query(this.table.insert(item))
      .then(js => when(js.first()).not.isDefined.reject(`Could not add items with id ${item.id}`))
      .then(j => this.table.in(j));
  }

  remove(id: Id, options?: TableOptions): Promise<boolean> {
    return this.provide(options)
      .command(this.table.delete().where(this.table.id.is(id)))
      .then(() => true);
  }

  update(item: Json, options?: TableOptions): Promise<Json> {
    return this.provide(options)
      .query(this.table.update(item).where(this.table.id.is(item.id)))
      .then(js => when(js.first()).not.isDefined.reject(`Could not update item with id ${item.id}`))
      .then(j => this.table.in(j));
  }
}
