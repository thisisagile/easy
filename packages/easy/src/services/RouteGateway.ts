import { Api } from './Api';
import { Func, Gateway, Id, Json, JsonValue, PageList, PageOptions, toPageList, Uri } from '../types';
import { HttpStatus, RequestOptions, toPageOptions } from '../http';

export class RouteGateway extends Gateway {
  constructor(readonly route: Func<Uri>, readonly routeId: Func<Uri>, readonly api: Api = new Api()) {
    super();
  }

  get(uri: Uri, options?: RequestOptions | PageOptions): Promise<PageList<Json>> {
    return this.api.get(uri, options).then(r => toPageList<Json>(r.body.data?.items, toPageOptions(options) && { total: r.body.data?.totalItems }));
  }

  getOne(uri: Uri, options?: RequestOptions): Promise<Json | undefined> {
    return this.get(uri, options).then(r => r.first());
  }

  all(options?: PageOptions): Promise<PageList<Json>> {
    return this.get(this.route(), options);
  }

  byId(id: Id): Promise<Json | undefined> {
    return this.getOne(this.routeId().id(id));
  }

  search(q: JsonValue, options?: PageOptions): Promise<PageList<Json>> {
    return this.get(this.route().query(q), options);
  }

  exists(id: Id): Promise<boolean> {
    return this.get(this.routeId().id(id))
      .then(r => r.length === 1)
      .catch(r => (HttpStatus.NotFound.equals(r.status) ? false : Promise.reject(r)));
  }

  add(item: Json): Promise<Json> {
    return this.post(this.route(), item);
  }

  post(uri: Uri, item?: Json): Promise<Json> {
    return this.api.post(uri, item).then(r => r.body.data?.items.first() ?? {});
  }

  update(item: Json): Promise<Json> {
    return this.patch(this.routeId().id(item.id), item);
  }

  patch(uri: Uri, item: Json): Promise<Json> {
    return this.api.patch(uri, item).then(r => r.body.data?.items.first() ?? {});
  }

  upsert(item: Json): Promise<Json> {
    return this.put(this.routeId().id(item.id), item);
  }

  put(uri: Uri, item: Json): Promise<Json> {
    return this.api.put(uri, item).then(r => r.body.data?.items.first() ?? {});
  }

  remove(id: Id): Promise<boolean> {
    return this.delete(this.routeId().id(id));
  }

  delete(uri: Uri): Promise<boolean> {
    return this.api.delete(uri).then(() => true);
  }
}
