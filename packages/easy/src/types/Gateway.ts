import { List } from './List';
import { Json, JsonValue } from './Json';
import { Id } from './Id';
import { Exception } from './Exception';
import { reject } from '../utils';

export abstract class Gateway {
  all(): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byId(id: Id): Promise<Json | undefined> {
    return reject(Exception.IsNotImplemented);
  }

  by(key: string, value: JsonValue): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byIds(...ids: Id[]): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  search(q: JsonValue): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  exists(id: Id): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }

  add(item: Json): Promise<Json> {
    return reject(Exception.IsNotImplemented);
  }

  update(item: Json): Promise<Json> {
    return reject(Exception.IsNotImplemented);
  }

  remove(id: Id): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }
}
