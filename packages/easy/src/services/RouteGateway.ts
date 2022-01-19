import { Api } from './Api';
import { Func, Gateway, Id, Json, JsonValue, List, toList, Uri } from '../types';
import { HttpStatus } from '../http';

export class RouteGateway extends Gateway {
  constructor(readonly route: Func<Uri>, readonly routeId: Func<Uri>, readonly api: Api = new Api()) {
    super();
  }

  get(uri: Uri): Promise<List<Json>> {
    return this.api.get(uri).then(r => r.body.data?.items ?? toList());
  }

  all(): Promise<List<Json>> {
    return this.get(this.route());
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.get(this.routeId().id(id)).then(r => r.first());
  }

  search(q: JsonValue): Promise<List<Json>> {
    return this.get(this.route().query(q));
  }

  exists(id: Id): Promise<boolean> {
    return this.get(this.routeId().id(id))
      .then(r => r.length === 1)
      .catch(r => (HttpStatus.NotFound.equals(r.status) ? false : Promise.reject(r)));
  }

  add(item: Json): Promise<Json> {
    return this.api.post(this.route(), item).then(r => r.body.data?.items.first() ?? {});
  }

  update(item: Json): Promise<Json> {
    return this.api.patch(this.routeId().id(item.id), item).then(r => r.body.data?.items.first() ?? {});
  }

  upsert(item: Json): Promise<Json> {
    return this.api.put(this.routeId().id(item.id), item).then(r => r.body.data?.items.first() ?? {});
  }

  remove(id: Id): Promise<boolean> {
    return this.api.delete(this.routeId().id(id)).then(() => true);
  }
}
