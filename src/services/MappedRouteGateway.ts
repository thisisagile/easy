import { Api } from './Api';
import { Id, Json, JsonValue, List } from '../types';
import { Map } from '../utils';
import { RouteGateway } from './RouteGateway';

export class MappedRouteGateway extends RouteGateway {
  constructor(readonly map = new Map(), readonly api: Api = new Api()) {
    super(api);
  }

  all(): Promise<List<Json>> {
    return super.all().then(is => is.map(i => this.map.in(i)));
  }

  byId(id: Id): Promise<Json> {
    return super.byId(id).then(i => this.map.in(i));
  }

  search(q: JsonValue): Promise<List<Json>> {
    return super.search(q).then(is => is.map(i => this.map.in(i)));
  }

  add(item: Json): Promise<Json> {
    return super.add(this.map.out(item));
  }

  update(item: Json): Promise<Json> {
    return super.update(this.map.out(item));
  }
}
