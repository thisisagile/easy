import { Gateway, Id, Json, JsonValue, List } from '../types';
import { Table } from './Table';
import { DataProvider } from './DataProvider';

export class TableGateway<T extends Table> implements Gateway {

  constructor(readonly table: T, readonly provider: DataProvider = table.db.provider) {}

  add(item: Json): Promise<Json> {
    return Promise.resolve(undefined);
  }

  all(): Promise<List<Json>> {
    return this.provider.query(this.table.select());
  }

  byId(id: Id): Promise<Json> {
    const select = this.table.select().where(this.table.id.is(id));
    return this.provider.query(select).then(js => js.first());
  }

  exists(id: Id): Promise<boolean> {
    const select = this.table.select().where(this.table.id.is(id));
    return this.provider.query(select).then(js => js.length > 0);
  }

  remove(id: Id): Promise<boolean> {
    return Promise.resolve(false);
  }

  search(q: JsonValue): Promise<List<Json>> {
    return Promise.resolve(undefined);
  }

  update(item: Json): Promise<Json> {
    return Promise.resolve(undefined);
  }
}
