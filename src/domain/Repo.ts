import { Constructor, Gateway, Id, Json, JsonValue, List, toJson } from '../types';
import { when } from '../validation';
import { resolve } from '../utils';
import { Struct } from './Struct';

export class Repo<T extends Struct> {
  constructor(protected ctor: Constructor<T>, private gateway: Gateway) {}

  all = (): Promise<List<T>> => this.gateway.all().then(js => js.map(j => new this.ctor(j)));
  byId = (id: Id): Promise<T> =>
    this.gateway
      .byId(id)
      .then(j => when(j).not.isDefined.reject(new Error('Does not exist')))
      .then(j => new this.ctor(j));
  search = (q: JsonValue): Promise<List<T>> => this.gateway.search(q).then(js => js.map(j => new this.ctor(j)));
  exists = (id: Id): Promise<boolean> => this.gateway.exists(id);

  add = (json: Json): Promise<T> =>
    when(new this.ctor(json))
      .not.isValid.reject()
      .then(i => this.validate(i))
      .then(i => this.gateway.add(toJson(i)))
      .then(j => new this.ctor(j));

  update = (json: Json): Promise<T> =>
    this.gateway
      .byId(json.id as Id)
      .then(j => when(j).not.isDefined.reject(new Error('Does not exist')))
      .then(j => new this.ctor(j).update(json))
      .then(i => when(i).not.isValid.reject())
      .then(i => this.gateway.update(toJson(i)))
      .then(j => new this.ctor(j));

  remove = (id: Id): Promise<void> => this.gateway.remove(id);

  validate = (item: T): Promise<T> => resolve(item);
}
