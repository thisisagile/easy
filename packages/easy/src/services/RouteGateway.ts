import { Api } from './Api';
import { ApiGateway } from './ApiGateway';
import { Func } from '../types/Func';
import { Uri, UriExpandProps } from '../types/Uri';
import { PageList } from '../types/PageList';
import { Json, JsonValue } from '../types/Json';
import { Id } from '../types/Id';
import { Optional } from '../types/Types';
import { List } from '../types/List';
import { toArray } from '../types/Array';
import { HttpStatus } from '../http/HttpStatus';
import { isDefined } from '../types/Is';

export class RouteGateway<Props extends UriExpandProps = UriExpandProps> extends ApiGateway {
  constructor(
    readonly route: Func<Uri<Props>>,
    readonly routeId: Func<Uri<Props>>,
    readonly api: Api = new Api()
  ) {
    super(api);
  }

  all(options?: Props): Promise<PageList<Json>> {
    return this.get(this.route().expand(options ?? {}) as Uri, options);
  }

  byId(id: Id): Promise<Optional<Json>> {
    return this.getOne(this.routeId().id(id) as Uri);
  }

  byIds(...ids: Id[]): Promise<List<Json>> {
    return this.get(this.route().ids(toArray(...ids)) as Uri);
  }

  search(q: JsonValue, options?: Props): Promise<PageList<Json>> {
    return this.get(this.route().expand({ ...options, q } as Props) as Uri);
  }

  exists(id: Id): Promise<boolean> {
    return this.byId(id)
      .then(r => isDefined(r))
      .catch(r => (HttpStatus.NotFound.equals(r.status) ? false : Promise.reject(r)));
  }

  add(item: Json): Promise<Json> {
    return this.post(this.route() as Uri, item);
  }

  filter(options?: Props): Promise<PageList<Json>> {
    return this.postSearch(this.route().expand(options ?? {}) as Uri);
  }

  update(item: Json): Promise<Json> {
    return this.patch(this.routeId().id(item.id) as Uri, item);
  }

  upsert(item: Json): Promise<Json> {
    return this.put(this.routeId().id(item.id) as Uri, item);
  }

  remove(id: Id): Promise<boolean> {
    return this.delete(this.routeId().id(id) as Uri);
  }
}
