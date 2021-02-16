import { List, meta, Uri } from '../types';
import { Verb } from './Verb';
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

class Router implements Routes {
  constructor(readonly resource: Resource) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get endpoints(): List<Route> {
    return meta(this.resource)
      .properties('verb')
      .map(p => ({
        verb: p.get<Verb>('verb'),
        endpoint: this.resource[p.property],
        requires: {
          token: p.get<boolean>('token') ?? false,
          scope: p.get<Scope>('scope'),
          uc: p.get<UseCase>('uc'),
        },
      }));
  }
}

export const routes = (resource: Resource): Routes => new Router(resource);
