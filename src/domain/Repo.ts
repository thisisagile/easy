import { Constructor, Gateway, Id, Json, jsonify, JsonValue, List } from '../types';
import { when } from '../validation';
import { resolve } from '../utils';
import { Record } from './Record';

export class Repo<T extends Record> {
  constructor(protected ctor: Constructor<T>, private gateway: Gateway) {}

  all = (): Promise<List<T>> => this.gateway.all().then(js => js.map(j => new this.ctor(j)));
  byId = (id: Id): Promise<T> => this.gateway.byId(id).then(j => new this.ctor(j));
  search = (q: JsonValue): Promise<List<T>> => this.gateway.search(q).then(js => js.map(j => new this.ctor(j)));
  exists = (id: Id): Promise<boolean> => this.gateway.exists(id);

  add = (json: Json): Promise<T> =>
    when(new this.ctor(json)).not.isValid.reject()
      .then(i => this.validate(i))
      .then(i => this.gateway.add(jsonify(i)))
      .then(j => new this.ctor(j));

  update = (item: Json): Promise<T> =>
    this.gateway.byId(item.id as Id)
      .then(j => when(j).not.isDefined.reject('Does not exist'))
      .then(j => (new this.ctor(j)).update(j))
      .then(i => when(i).not.isValid.reject())
      .then(i => this.gateway.update(i.toJSON()))
      .then(j => new this.ctor(j));

  remove = (id: Id): Promise<boolean> => this.gateway.remove(id);

  validate = (item: T): Promise<T> => resolve(item);
}

