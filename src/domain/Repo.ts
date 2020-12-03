import { Constructor, Gateway, Id, Json, JsonValue, List } from '../types';

export class Repo<T> {
  constructor(protected ctor: Constructor<T>, private gateway: Gateway) {}

  all = (): Promise<List<T>> => this.gateway.all().then(js => js.map(j => new this.ctor(j)));
  byId = (id: Id): Promise<T> => this.gateway.byId(id).then(j => new this.ctor(j));
  search = (q: JsonValue): Promise<List<T>> => this.gateway.search(q).then(js => js.map(j => new this.ctor(j)));
  exists = (id: Id): Promise<boolean> => this.gateway.exists(id);

  add = (item: Json): Promise<T> => this.gateway.add(item).then(j => new this.ctor(j));
  update = (item: Json): Promise<T> => this.gateway.update(item).then(j => new this.ctor(j));
  remove = (id: Id): Promise<boolean> => this.gateway.remove(id);
}

