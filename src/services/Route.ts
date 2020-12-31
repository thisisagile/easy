import { List, meta, Uri } from '../types';
import { HttpVerb } from './HttpVerb';
import { Verb } from './Verb';
import { Req } from './Req';
import { Resource } from './Resource';

export const route = (uri: Uri): ClassDecorator => (subject: unknown): void => {
  meta(subject).set('route', uri);
};

export type Endpoint<T = unknown> = (re: Req) => Promise<T | List<T>>;
export type Route = { verb: HttpVerb; endpoint: Endpoint };
export type Routes = { route: Uri; endpoints: List<Route> };

class Router implements Routes {
  constructor(readonly resource: Resource) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get endpoints(): List<Route> {
    return meta(this.resource)
      .properties('verb')
      .map(p => ({ verb: p.get<Verb>('verb').verb, endpoint: this.resource[p.property] }));
  }
}

export const routes = (resource: Resource): Routes => new Router(resource);
