import { Exception, Id, Json, JsonValue, Key, List, PageList, PageOptions } from './index';
import { reject } from '../utils';

export class Repository<T> {
  all(options?: PageOptions): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  byId(id: Id): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return reject(Exception.IsNotImplemented);
  }

  byKey(key: Key, options?: PageOptions): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  by(key: keyof T, value: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  search(q: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return reject(Exception.IsNotImplemented);
  }

  filter(options?: PageOptions): Promise<PageList<T>> {
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
