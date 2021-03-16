import { List, meta, toList, Uri } from '../types';
import { Verb } from '../http';
import { Req } from './Req';
import { Resource } from './Resource';
import { Scope, UseCase } from '../process';

export const route = (uri: Uri): ClassDecorator => (subject: unknown): void => {
  meta(subject).set('route', uri);
};

export type Endpoint<T = unknown> = (re: Req) => Promise<T | List<T>>;
export type RouteRequires = { token: boolean; scope?: Scope; uc?: UseCase };
export type Route = { verb: Verb; endpoint: Endpoint; requires: RouteRequires };
export type Routes = { route: Uri; endpoints: List<Route> };

const toRoute = (verb: Verb, endpoint: Endpoint, requires: RouteRequires): Route => ({ verb, endpoint, requires });

class Router implements Routes {
  constructor(readonly resource: Resource) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get endpoints(): List<Route> {
    return meta(this.resource)
      .properties('verb')
      .map(v => {
        const verb = v.get<Verb>('verb');
        return verb
          ? toRoute(verb, this.resource[v.property], {
              token: v.get<boolean>('token') ?? false,
              scope: v.get<Scope>('scope'),
              uc: v.get<UseCase>('uc'),
            })
          : undefined;
      })
      .reduce((list, v) => (v ? list.add(v) : list), toList<Route>());
  }
}

export const routes = (resource: Resource): Routes => new Router(resource);
