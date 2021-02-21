import { Api } from './Api';
import { Gateway, Id, Json, JsonValue, List, Uri } from '../types';
import { HttpStatus } from '../http';

export class RouteGateway implements Gateway {
  readonly route: Uri;
  readonly routeId: Uri;

  constructor(readonly api: Api = new Api()) {}

  all(): Promise<List<Json>> {
    return this.api.get(this.route).then(r => r.body.data.items);
  }

  byId(id: Id): Promise<Json> {
    return this.api.get(this.routeId.id(id)).then(r => r.body.data.items.first());
  }

  search(q: JsonValue): Promise<List<Json>> {
    return this.api.get(this.route.query(q)).then(r => r.body.data.items);
  }

  exists(id: Id): Promise<boolean> {
    return this.api
      .get(this.routeId.id(id))
      .then(r => r.body.data.items.length === 1)
      .catch(r => (HttpStatus.NotFound.equals(r.status) ? false : Promise.reject(r)));
  }

  add(item: Json): Promise<Json> {
    return this.api.post(this.route, item).then(r => r.body.data.items.first());
  }

  update(item: Json): Promise<Json> {
    return this.api.patch(this.routeId.id(item.id), item).then(r => r.body.data.items.first());
  }

  remove(id: Id): Promise<void> {
    return this.api.delete(this.routeId.id(id)).then();
  }
}
