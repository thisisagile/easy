import { Struct } from './Struct';
import { FetchOptions, Gateway } from '../types/Gateway';
import { Repository } from '../types/Repository';
import { Constructor } from '../types/Constructor';
import { Json, JsonValue, toJson } from '../types/Json';
import { isValidatable } from '../types/Validatable';
import { PageList } from '../types/PageList';
import { Id, Key } from '../types/Id';
import { when } from '../validation/When';
import { Exception } from '../types/Exception';
import { asList, List } from '../types/List';
import { reject, resolve } from '../utils/Promise';

export type RepoAction = 'add' | 'update' | 'remove';

export class Repo<T extends Struct, Options = FetchOptions> extends Repository<T, Options> {
  constructor(
    protected ctor: Constructor<T>,
    private readonly gateway: Gateway<Options>
  ) {
    super();
  }

  create = (item: T | Json): T => (isValidatable(item) ? item : new this.ctor(item));

  all(options?: Options): Promise<PageList<T>> {
    return this.gateway.all(options).then(js => js.map(i => new this.ctor(i)));
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

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return this.gateway.by('key', key, options).then(js => js.map(i => new this.ctor(i)));
  }

  by(key: keyof T, value: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options).then(js => js.map(i => new this.ctor(i)));
  }

  search(q: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.search(q, options).then(js => js.map(i => new this.ctor(i)));
  }

  filter(options?: Options): Promise<PageList<T>> {
    return this.gateway.filter(options).then(js => js.map(i => new this.ctor(i)));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }

  add(t: T | Json): Promise<T> {
    return this.extend(this.create(t), 'add')
      .then(i => when(i).not.isValid.reject())
      .then(i => this.validate(i, 'add'))
      .then(i => this.gateway.add(toJson(i)))
      .then(j => new this.ctor(j));
  }

  update(id: Id, json: Json): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => new this.ctor(j).update(json) as T)
      .then(i => this.extend(i, 'update'))
      .then(i => when(i).not.isValid.reject())
      .then(i => this.validate(i, 'update'))
      .then(i => this.gateway.update(toJson(i)))
      .then(j => new this.ctor(j));
  }

  remove(id: Id): Promise<boolean> {
    return this.gateway.remove(id);
  }

  extend(item: T, _action?: RepoAction): Promise<T> {
    return resolve(item);
  }

  validate(item: T, _action?: RepoAction): Promise<T> {
    return resolve(item);
  }

  upsert(id: Id, item: Json): Promise<T> {
    return this.update(id, item).catch(e => (Exception.DoesNotExist.equals(e) ? this.add(item) : reject(e)));
  }
}
