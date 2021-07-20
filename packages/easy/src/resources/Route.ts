import { isDefined, List, meta, Uri } from '../types';
import { Verb } from '../http';
import { Req } from './Req';
import { Resource } from './Resource';
import { Scope, UseCase } from '../process';

export const route =
  (uri: Uri): ClassDecorator =>
  (subject: unknown): void => {
    meta(subject).set('route', uri);
  };

export type Endpoint<T = unknown> = (re: Req) => Promise<T | List<T>>;
export type RouteRequires = { token: boolean; scope?: Scope; uc?: UseCase };
export type Route = { verb: Verb; endpoint: Endpoint; requires: RouteRequires };
export type Routes = { route: Uri; endpoints: List<Route> };

const toRoute = (endpoint: Endpoint, requires: RouteRequires, verb?: Verb): Route | undefined =>
  isDefined(verb)
    ? {
        verb,
        endpoint,
        requires,
      }
    : undefined;

class Router implements Routes {
  constructor(readonly resource: Resource) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get endpoints(): List<Route> {
    return meta(this.resource)
      .properties('verb')
      .mapDefined(v =>
        toRoute(
          this.resource[v.property],
          {
            token: v.get<boolean>('token') ?? false,
            scope: v.get<Scope>('scope'),
            uc: v.get<UseCase>('uc'),
          },
          v.get<Verb>('verb')
        )
      );
  }
}

export const routes = (resource: Resource): Routes => new Router(resource);
