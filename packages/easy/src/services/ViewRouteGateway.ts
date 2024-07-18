import { Api } from './Api';
import { RouteGateway } from './RouteGateway';
import { Func } from '../types/Func';
import { Uri } from '../types/Uri';
import { view } from '../utils/View';
import { RequestOptions } from '../http/RequestOptions';
import { PageList } from '../types/PageList';
import { Json } from '../types/Json';
import { Optional } from '../types/Types';

export class ViewRouteGateway extends RouteGateway {
  constructor(
    readonly route: Func<Uri>,
    readonly routeId: Func<Uri>,
    readonly views = {
      in: view({}).fromSource,
      out: view({}).fromSource,
    },
    readonly api: Api = new Api()
  ) {
    super(route, routeId, api);
  }

  get(uri: Uri, options?: RequestOptions): Promise<PageList<Json>> {
    return super.get(uri, options).then(is => is.map(i => this.views.in.from(i)));
  }

  getOne(uri: Uri, options?: RequestOptions): Promise<Optional<Json>> {
    return super
      .get(uri, options)
      .then(is => is.first())
      .then(i => this.views.in.from(i));
  }

  add(item: Json): Promise<Json> {
    return super.add(this.views.out.from(item));
  }

  update(item: Json): Promise<Json> {
    return super.update(this.views.out.from(item));
  }
}
