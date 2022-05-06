import { Api } from './Api';
import { Func, Gateway, Id, Json, JsonValue, PageList, toPageList, Uri } from '../types';
import { HttpStatus, RequestOptions } from '../http';

export class RouteGateway extends Gateway {
  constructor(readonly route: Func<Uri>, readonly routeId: Func<Uri>, readonly api: Api = new Api()) {
    super();
  }

  get(uri: Uri, options?: RequestOptions): Promise<PageList<Json>> {
    return this.api.get(uri, options).then(r => toPageList<Json>(r.body.data?.items, {total: r.body.data?.totalItems}));
  }

  getOne(uri: Uri, options?: RequestOptions): Promise<Json | undefined> {
    return this.get(uri, options).then(r => r.first());
  }

  all(): Promise<PageList<Json>> {
    return this.get(this.route());
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.getOne(this.routeId().id(id));
  }

  search(q: JsonValue): Promise<PageList<Json>> {
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
