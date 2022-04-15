import { Api } from './Api';
import { Func, Id, Json, JsonValue, List, Uri } from '../types';
import { view } from '../utils';
import { RouteGateway } from './RouteGateway';

export class ViewRouteGateway extends RouteGateway {
  constructor(
    readonly route: Func<Uri>,
    readonly routeId: Func<Uri>,
    readonly views = {
      in: view({}).fromSource,
      out: view({}).fromSource,
    },
    readonly api: Api = new Api(),
  ) {
    super(route, routeId, api);
  }

  all(): Promise<List<Json>> {
    return super.all().then(is => is.map(i => this.views.in.from(i)));
  }

  byId(id: Id): Promise<Json | undefined> {
    return super.byId(id).then(i => this.views.in.from(i));
  }

  search(q: JsonValue): Promise<List<Json>> {
    return super.search(q).then(is => is.map(i => this.views.in.from(i)));
  }

  add(item: Json): Promise<Json> {
    return super.add(this.views.out.from(item));
  }

  update(item: Json): Promise<Json> {
    return super.update(this.views.out.from(item));
  }
}
