import { List, meta, Optional, tryTo, Uri, Scope, UseCase } from '@thisisagile/easy';
import { Req } from '../../../easy/src/resources/Req';
import { Resource } from './Resource';
import { RequestHandler } from 'express';
import { Verb } from '../http';

export const route =
  (uri: Uri): ClassDecorator =>
  (subject: unknown): void => {
    meta(subject).set('route', uri);
  };

export type Endpoint<T = unknown> = (re: Req) => Promise<T | List<T>>;
export type RouteRequires = { token: boolean; labCoat: boolean; scope?: Scope; uc?: UseCase };
export type Route = { verb: Verb; endpoint: Endpoint; requires: RouteRequires; middleware: RequestHandler[] };
export type Routes = { route: Uri; middleware: RequestHandler[]; endpoints: List<Route> };

const toRoute = (endpoint: Endpoint, requires: RouteRequires, verb?: Verb, middleware?: RequestHandler[]): Optional<Route> =>
  tryTo(verb)
    .is.defined()
    .map(verb => ({ verb, endpoint, requires, middleware: middleware ?? [] }) as Route)
    .orElse();

class Router implements Routes {
  constructor(readonly resource: Resource) {}

  get route(): Uri {
    return meta(this.resource).get('route');
  }

  get middleware(): RequestHandler[] {
    return meta(this.resource).get<RequestHandler[]>('middleware') ?? [];
  }

  get endpoints(): List<Route> {
    return meta(this.resource)
      .properties('verb')
      .mapDefined(v =>
        toRoute(
          this.resource[v.property],
          {
            labCoat: v.get<boolean>('labCoat') ?? false,
            token: v.get<boolean>('token') ?? false,
            scope: v.get<Scope>('scope'),
            uc: v.get<UseCase>('uc'),
          },
          v.get<Verb>('verb'),
          v.get<RequestHandler[]>('middleware')
        )
      );
  }
}

export const routes = (resource: Resource): Routes => new Router(resource);
