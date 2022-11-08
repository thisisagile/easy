import { asList, asPageList, Constructor, Exception, Gateway, Id, isValidatable, Json, JsonValue, Key, List, PageList, PageOptions, toJson } from '../types';
import { when } from '../validation';
import { reject, resolve } from '../utils';
import { Struct } from './Struct';
import { Repository } from './Repository';

export class Repo<T extends Struct> extends Repository<T> {
  constructor(protected ctor: Constructor<T>, private readonly gateway: Gateway) {
    super();
  }

  create = (item: T | Json): T => (isValidatable(item) ? item : new this.ctor(item));

  all(options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.all(options).then(js => asPageList(this.ctor, js));
  }

  byId(id: Id): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => new this.ctor(j));
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.gateway.byIds(...ids).then(j => asList(this.ctor, j));
  }

  byKey(key: Key, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.by('key', key, options).then(js => asPageList(this.ctor, js));
  }

  by(key: keyof T, value: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options).then(js => asPageList(this.ctor, js));
  }

  search(q: JsonValue, options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.search(q, options).then(js => asPageList(this.ctor, js));
  }

  filter(options?: PageOptions): Promise<PageList<T>> {
    return this.gateway.filter(options).then(js => asPageList(this.ctor, js));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }

  add(t: T | Json): Promise<T> {
    return this.extend(this.create(t))
      .then(i => when(i).not.isValid.reject())
      .then(i => this.validate(i))
      .then(i => this.gateway.add(toJson(i)))
      .then(j => new this.ctor(j));
  }

  update(id: Id, json: Json): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => new this.ctor(j).update(json) as T)
      .then(i => this.extend(i))
      .then(i => when(i).not.isValid.reject())
      .then(i => this.validate(i))
      .then(i => this.gateway.update(toJson(i)))
      .then(j => new this.ctor(j));
  }

  remove(id: Id): Promise<boolean> {
    return this.gateway.remove(id);
  }

  extend(item: T): Promise<T> {
    return resolve(item);
  }

  validate(item: T): Promise<T> {
    return resolve(item);
  }

  upsert(id: Id, item: Json): Promise<T> {
    return this.update(id, item).catch(e => (Exception.DoesNotExist.equals(e) ? this.add(item) : reject(e)));
  }
}
