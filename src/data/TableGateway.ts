import { Constructor, Gateway, Id, Json, JsonValue, List } from '../types';
import { Table } from './Table';
import { DataProvider } from './DataProvider';

export class TableGateway implements Gateway {
  constructor(ctor: Constructor<Table>, readonly provider: DataProvider, readonly table = new ctor()) {}

  add(item: Json): Promise<Json> {
    return Promise.resolve(undefined);
  }

  all(): Promise<List<Json>> {
    return Promise.resolve(undefined);
  }

  byId(id: Id): Promise<Json> {
    return Promise.resolve(undefined);
  }

  exists(id: Id): Promise<boolean> {
    return Promise.resolve(false);
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
