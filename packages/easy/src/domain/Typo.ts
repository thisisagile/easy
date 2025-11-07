import { View } from '../utils/View';
import { FetchOptions, Gateway } from '../types/Gateway';
import { Repository } from '../types/Repository';
import { Json, JsonValue, toJson } from '../types/Json';
import { PageList } from '../types/PageList';
import { Id, Key } from '../types/Id';
import { when } from '../validation/When';
import { Exception } from '../types/Exception';
import { List } from '../types/List';
import { RouteGateway } from '../services/RouteGateway';
import { RouteOptions } from '../services/Api';

export class Typo<T, Options extends RouteOptions = RouteOptions> extends Repository<T, Options> {
  constructor(
    protected view: View<T>,
    private readonly gateway: Gateway<Options>
  ) {
    super();
  }

  create = (j: Json): T => this.view.from(j);

  all(options?: Options): Promise<PageList<T>> {
    return this.gateway.all(options).then(js => js.map(this.create));
  }

  byId(id: Id): Promise<T> {
    return this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(Exception.DoesNotExist))
      .then(j => this.create(j));
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.gateway.byIds(...ids).then(js => js.map(this.create));
  }

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return this.gateway.by('key', key, options).then(js => js.map(this.create));
  }

  by(key: keyof T, value: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options).then(js => js.map(this.create));
  }

  search(q: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.search(q, options).then(js => js.map(this.create));
  }

  filter(options?: Options): Promise<PageList<T>> {
    return this.gateway.filter(options).then(js => js.map(j => this.create(j)));
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }
}

export class Agent<T, Options extends FetchOptions = FetchOptions> extends Repository<T, Options> {
  constructor(private gateway: RouteGateway) {
    super();
  }

  all(options?: Options): Promise<PageList<T>> {
    return this.gateway.all(options) as Promise<PageList<T>>;
  }

  byId(id: Id): Promise<T> {
    return this.gateway.byId(id) as Promise<T>;
  }

  byIds(...ids: Id[]): Promise<List<T>> {
    return this.gateway.byIds(...ids) as Promise<List<T>>;
  }

  byKey(key: Key, options?: Options): Promise<PageList<T>> {
    return this.gateway.by('key', key, options) as Promise<PageList<T>>;
  }

  by(key: keyof T, value: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.by(key.toString(), value, options) as Promise<PageList<T>>;
  }

  search(q: JsonValue, options?: Options): Promise<PageList<T>> {
    return this.gateway.search(q, options) as Promise<PageList<T>>;
  }

  filter(options?: Options): Promise<PageList<T>> {
    return this.gateway.filter(options) as Promise<PageList<T>>;
  }

  exists(id: Id): Promise<boolean> {
    return this.gateway.exists(id);
  }

  add(t: Partial<T>): Promise<T> {
    return this.gateway.add(toJson(t)) as Promise<T>;
  }

  update(id: Id, t: Partial<T>): Promise<T> {
    return this.gateway.update({ ...toJson(t), id }) as Promise<T>;
  }

  upsert(id: Id, t: Partial<T>): Promise<T> {
    return this.gateway.upsert({ ...toJson(t), id }) as Promise<T>;
  }

  remove(id: Id): Promise<boolean> {
    return this.gateway.remove(id);
  }
}
