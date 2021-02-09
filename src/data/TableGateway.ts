import { Gateway, Id, isDefined, Json, List } from '../types';
import { Table } from './Table';
import { DataProvider } from './DataProvider';
import { when } from '../validation';

export class TableGateway<T extends Table> implements Gateway {
  constructor(readonly table: T, readonly provider: DataProvider = table.db.provider) {}

  all(): Promise<List<Json>> {
    return this.provider.query(this.table.select());
  }

  byId(id: Id): Promise<Json> {
    return this.provider.query(this.table.select().where(this.table.id.is(id))).then(js => js.first());
  }

  exists(id: Id): Promise<boolean> {
    return this.byId(id).then(j => isDefined(j));
  }

  add(item: Json): Promise<Json> {
    return this.provider
      .query(this.table.insert(item))
      .then(js => when(js.first()).not.isDefined.reject(`Could not add items with id ${item.id}`))
      .then(j => this.table.in(j));
  }

  remove(id: Id): Promise<void> {
    return this.provider.command(this.table.delete().where(this.table.id.is(id))).then();
  }

  update(item: Json): Promise<Json> {
    return this.provider
      .query(this.table.update(item).where(this.table.id.is(item.id)))
      .then(js => when(js.first()).not.isDefined.reject(`Could not update item with id ${item.id}`))
      .then(j => this.table.in(j));
  }
}
