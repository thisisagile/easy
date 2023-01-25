import { Api, RouteOptions } from './Api';
import { Func, Id, Json, JsonValue, Optional, PageList, Uri } from '../types';
import { HttpStatus } from '../http';
import { ApiGateway } from './ApiGateway';

export class RouteGateway extends ApiGateway {
  constructor(readonly route: Func<Uri>, readonly routeId: Func<Uri>, readonly api: Api = new Api()) {
    super(api);
  }

  all(options?: RouteOptions): Promise<PageList<Json>> {
    return this.get(this.route(), options);
  }

  byId(id: Id, options?: RouteOptions): Promise<Optional<Json>> {
    return this.getOne(this.routeId().id(id));
  }

  search(q: JsonValue, options?: RouteOptions): Promise<PageList<Json>> {
    return this.get(this.route().query(q), options);
  }

  exists(id: Id, options?: RouteOptions): Promise<boolean> {
    return this.get(this.routeId().id(id))
      .then(r => r.length === 1)
      .catch(r => (HttpStatus.NotFound.equals(r.status) ? false : Promise.reject(r)));
  }

  add(item: Json, options?: RouteOptions): Promise<Json> {
    return this.post(this.route(), item, options);
  }

  filter(options?: RouteOptions): Promise<PageList<Json>> {
    return this.postSearch(this.route(), options);
  }

  update(item: Json, options?: RouteOptions): Promise<Json> {
    return this.patch(this.routeId().id(item.id), item, options);
  }

  upsert(item: Json, options?: RouteOptions): Promise<Json> {
    return this.put(this.routeId().id(item.id), item, options);
  }

  remove(id: Id, options?: RouteOptions): Promise<boolean> {
    return this.delete(this.routeId().id(id), options);
  }
}
