import { Constructor, Exception, Gateway, Id, Json, JsonValue, List, toJson } from '../types';
import { when } from '../validation';
import { reject, resolve } from '../utils';
import { Struct } from './Struct';

export class Repo<T extends Struct> {
  constructor(protected ctor: Constructor<T>, private readonly gateway: Gateway) {}

  all(): Promise<List<T>> {
    return this.gateway.all().then(js => js.map(j => new this.ctor(j)));
  }

  byId(id: Id): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => new this.ctor(j));
  }

  by(key: keyof T, value: JsonValue): Promise<List<T>> {
    return this.gateway.by(key.toString(), value).then(js => js.map(j => new this.ctor(j)));
  }

  search(q: JsonValue): Promise<List<T>> {
    return this.gateway.search(q).then(js => js.map(j => new this.ctor(j)));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }

  add(json: Json): Promise<T> {
    return when(new this.ctor(json))
      .not.isValid.reject()
      .then(i => this.validate(i))
      .then(i => this.gateway.add(toJson(i)))
      .then(j => new this.ctor(j));
  }

  update(id: Id, json: Json): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => new this.ctor(j).update(json))
      .then(i => when(i as T).not.isValid.reject())
      .then(i => this.validate(i))
      .then(i => this.gateway.update(toJson(i)))
      .then(j => new this.ctor(j));
  }

  remove(id: Id): Promise<boolean> {
    return this.gateway.remove(id);
  }

  validate(item: T): Promise<T> {
    return resolve(item);
  }

  upsert(id: Id, item: Json): Promise<T> {
    return this.update(id, item).catch(e => (Exception.DoesNotExist.equals(e) ? this.add(item) : reject(e)));
  }
}
