import { FetchOptions } from './Gateway';
import { PageList } from './PageList';
import { Exception } from './Exception';
import { reject } from '../utils/Promise';
import { Id, Key } from './Id';
import { List } from './List';
import { Json, JsonValue } from './Json';

export class Repository<T, Options = FetchOptions> {
  all(options?: Options): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  byId(id: Id): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return reject(Exception.IsNotImplemented);
  }

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  by(key: keyof T, value: JsonValue, options?: Options): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  search(q: JsonValue, options?: Options): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  filter(options?: Options): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  exists(id: Id): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }

  add(t: T | Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  update(id: Id, json: Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  remove(id: Id): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }

  upsert(id: Id, item: Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }
}
