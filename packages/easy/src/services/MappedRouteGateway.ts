import { Api } from './Api';
import { RouteGateway } from './RouteGateway';
import { Func } from '../types/Func';
import { Uri } from '../types/Uri';
import { Mapper } from '../utils/Mapper';
import { RequestOptions } from '../http/RequestOptions';
import { PageList } from '../types/PageList';
import { Json } from '../types/Json';
import { Optional } from '../types/Types';

export class MappedRouteGateway extends RouteGateway {
  constructor(
    readonly route: Func<Uri>,
    readonly routeId: Func<Uri>,
    readonly map = new Mapper(),
    readonly api: Api = new Api()
  ) {
    super(route, routeId, api);
  }

  get(uri: Uri, options?: RequestOptions): Promise<PageList<Json>> {
    return super.get(uri, options).then(is => is.map(i => this.map.in(i)));
  }

  getOne(uri: Uri, options?: RequestOptions): Promise<Optional<Json>> {
    return super
      .get(uri, options)
      .then(is => is.first())
      .then(i => this.map.in(i));
  }

  add(item: Json): Promise<Json> {
    return super.add(this.map.out(item));
  }

  update(item: Json): Promise<Json> {
    return super.update(this.map.out(item));
  }
}
