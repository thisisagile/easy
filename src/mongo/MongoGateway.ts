import { Exception, Gateway, Id, isDefined, Json, JsonValue, List } from '../types';
import { reject } from '../utils';
import { Collection } from './Collection';

export class MongoGateway<C extends Collection> implements Gateway {
  constructor(readonly collection: C, readonly provider = collection.db.provide<Gateway>()) {}

  all(): Promise<List<Json>> {
    return this.provider.all();
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.provider.byId(id);
  }

  by(key: string, value: JsonValue): Promise<List<Json>> {
    return this.provider.by(key, value);
  }

  search(_q: JsonValue): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  exists(id: Id): Promise<boolean> {
    return this.provider.byId(id).then(i => isDefined(i));
  }

  add(item: Json): Promise<Json> {
    return this.provider.add(item);
  }

  update(item: Json): Promise<Json> {
    return this.provider.update(item);
  }

  remove(id: Id): Promise<boolean> {
    return this.provider.remove(id);
  }
}
