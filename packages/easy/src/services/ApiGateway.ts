import { Api, RouteOptions } from './Api';
import { FetchOptions, Filter, Gateway, Json, PageList, toPageList, Uri } from '../types';
import { RequestOptions, toPageOptions } from '../http';

export class ApiGateway extends Gateway<RouteOptions> {
  constructor(readonly api: Api = new Api()) {
    super();
  }

  get(uri: Uri, options?: RouteOptions): Promise<PageList<Json>> {
    return this.api.get(uri, options).then(r =>
      toPageList<Json>(
        r.body.data?.items,
        toPageOptions(options) && {
          total: r.body.data?.totalItems,
          filters: r.body.data?.meta?.filters as Filter[],
        }
      )
    );
  }

  getOne(uri: Uri, options?: RouteOptions): Promise<Json | undefined> {
    return this.get(uri, options).then(r => r.first());
  }

  post(uri: Uri, item?: Json, options?: RouteOptions): Promise<Json> {
    return this.api.post(uri, item, options).then(r => r.body.data?.items.first() ?? {});
  }

  postSearch(uri: Uri, options?: RequestOptions | FetchOptions): Promise<PageList<Json>> {
    return this.api.post(uri, options).then(r =>
      toPageList<Json>(
        r.body.data?.items,
        toPageOptions(options) && {
          total: r.body.data?.totalItems,
          filters: r.body.data?.meta?.filters as Filter[],
        }
      )
    );
  }

  patch(uri: Uri, item: Json, options?: RouteOptions): Promise<Json> {
    return this.api.patch(uri, item, options).then(r => r.body.data?.items.first() ?? {});
  }

  put(uri: Uri, item: Json, options?: RouteOptions): Promise<Json> {
    return this.api.put(uri, item, options).then(r => r.body.data?.items.first() ?? {});
  }

  delete(uri: Uri, options?: RouteOptions): Promise<boolean> {
    return this.api.delete(uri, options).then(() => true);
  }
}
