import {
  Exception,
  Gateway,
  Id,
  Json,
  JsonValue,
  Key,
  List,
  PageList,
  PageOptions,
  toList,
  toPageList,
} from '../types';
import { when } from '../validation';
import { reject, resolve, View } from '../utils';

export class Typo<T> {
  constructor(protected view: View, private readonly gateway: Gateway) {
  }

  create = (j: Json): T => this.view.from(j) as unknown as T;

  all(options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.all(options).then(js => toPageList(js.map(j => this.create(j))));
  }

  byId(id: Id): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => this.create(j));
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.gateway.byIds(...ids).then(js => toList(js.map(j => this.create(j))));
  }

  byKey(key: Key, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.by('key', key, options).then(js => toPageList(js.map(j => this.create(j))));
  }

  by(key: keyof T, value: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options).then(js => toPageList(js.map(j => this.create(j))));
  }

  search(q: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.search(q, options).then(js => toPageList(js.map(j => this.create(j))));
  }

  filter(options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.filter(options).then(js => toPageList(js.map(j => this.create(j))));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }

  add(_t: T | Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  update(_id: Id, _json: Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }

  remove(_id: Id): Promise<boolean> {
    return reject(Exception.IsNotImplemented);
  }

  extend(item: T): Promise<T> {
    return resolve(item);
  }

  validate(item: T): Promise<T> {
    return resolve(item);
  }

  upsert(_id: Id, _item: Json): Promise<T> {
    return reject(Exception.IsNotImplemented);
  }
}
