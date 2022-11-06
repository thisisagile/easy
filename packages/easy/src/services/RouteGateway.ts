import {Api, RouteOptions} from './Api';
import {FetchOptions, Filter, Func, Gateway, Id, Json, JsonValue, PageList, toPageList, Uri} from '../types';
import {HttpStatus, RequestOptions, toPageOptions} from '../http';

export class RouteGateway extends Gateway<RouteOptions> {
    constructor(readonly route: Func<Uri>, readonly routeId: Func<Uri>, readonly api: Api = new Api()) {
        super();
    }

    get(uri: Uri, options?: RouteOptions): Promise<PageList<Json>> {
        return this.api.get(uri, options).then(r => toPageList<Json>(r.body.data?.items, toPageOptions(options) && {
            total: r.body.data?.totalItems,
            filters: r.body.data?.meta?.filters as Filter[],
        }));
    }

    getOne(uri: Uri, options?: RouteOptions): Promise<Json | undefined> {
        return this.get(uri, options).then(r => r.first());
    }

    all(options?: RouteOptions): Promise<PageList<Json>> {
        return this.get(this.route(), options);
    }

    byId(id: Id, options?: RouteOptions): Promise<Json | undefined> {
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
        return this.post(this.route(), item);
    }

    filter(options?: RouteOptions): Promise<PageList<Json>> {
        return this.postSearch(this.route(), options);
    }

    update(item: Json, options?: RouteOptions): Promise<Json> {
        return this.patch(this.routeId().id(item.id), item);
    }

    upsert(item: Json, options?: RouteOptions): Promise<Json> {
        return this.put(this.routeId().id(item.id), item);
    }

    remove(id: Id, options?: RouteOptions): Promise<boolean> {
        return this.delete(this.routeId().id(id));
    }

    post(uri: Uri, item?: Json): Promise<Json> {
        return this.api.post(uri, item).then(r => r.body.data?.items.first() ?? {});
    }

    postSearch(uri: Uri, options?: RequestOptions | FetchOptions): Promise<PageList<Json>> {
        return this.api.post(uri, options).then(r => toPageList<Json>(r.body.data?.items, toPageOptions(options) && {
            total: r.body.data?.totalItems,
            filters: r.body.data?.meta?.filters as Filter[],
        }));
    }

    patch(uri: Uri, item: Json): Promise<Json> {
        return this.api.patch(uri, item).then(r => r.body.data?.items.first() ?? {});
    }

    put(uri: Uri, item: Json): Promise<Json> {
        return this.api.put(uri, item).then(r => r.body.data?.items.first() ?? {});
    }

    delete(uri: Uri, options?: RouteOptions): Promise<boolean> {
        return this.api.delete(uri).then(() => true);
    }
}
