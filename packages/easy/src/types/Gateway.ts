import { Json, JsonValue } from './Json';
import { Id } from './Id';
import { Exception } from './Exception';
import { reject } from '../utils';
import { PageList, PageOptions } from './PageList';
import { List } from './List';

export abstract class Gateway {
  all(options?: PageOptions): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byId(id: Id): Promise<Json | undefined> {
    return reject(Exception.IsNotImplemented);
  }

  by(_key: string, _value: JsonValue, _options?: PageOptions): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  byIds(..._ids: Id[]): Promise<List<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  search(q: JsonValue, options?: PageOptions): Promise<PageList<Json>> {
    return reject(Exception.IsNotImplemented);
  }

  filter(options?: PageOptions): Promise<PageList<Json>> {
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
