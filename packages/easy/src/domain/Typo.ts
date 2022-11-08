import { Exception, Gateway, Id, Json, JsonValue, Key, List, PageList, PageOptions, toList, toPageList } from '../types';
import { when } from '../validation';
import { View } from '../utils';
import { Repository } from './Repository';

export class Typo<T> extends Repository<T> {
  constructor(protected view: View, private readonly gateway: Gateway) {
    super();
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
}
