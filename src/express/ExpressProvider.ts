import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { checkScope, checkToken, checkUseCase } from './SecurityHandler';
import { choose } from '../utils';
import { isDefined, toList } from '../types';
import { ContentType, HttpStatus, rest, RestResult, toOriginatedError } from '../http';
import { AppProvider, Endpoint, Handler, Resource, Route, routes, Service, toReq, VerbOptions } from '../resources';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export const toBody = (status: HttpStatus, outcome?: unknown): RestResult =>
  choose<RestResult, any>(outcome)
    .case(() => HttpStatus.NoContent.equals(status), {})
    .case(
      o => !isDefined(o),
      () => rest.toData(status, [])
    )
    .else(o => rest.toData(status, toList(o)));

export const toExpressResponse = (res: Response, result?: unknown, options?: VerbOptions): void => {
  const OkStatus = options.onOk ?? HttpStatus.Ok;
  res.status(OkStatus.status);
  res.type(options.type?.id.toString() ?? ContentType.Json.code);

  choose<void, ContentType>(options.type)
    .case(
      ct => ContentType.Json.equals(ct),
      () => res.json(toBody(OkStatus, result))
    )
    .case(
      ct => ContentType.Stream.equals(ct),
      () => res.end(result)
    );
};

export class ExpressProvider implements AppProvider {
  constructor(protected app: Express = express()) {
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

  protected handle = (endpoint: Endpoint, options: VerbOptions): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req))
      .then((r: any) => toExpressResponse(res, r, options))
      .catch(error => next(toOriginatedError(error, options)));

  use = (handler: Handler): void => {
    this.app.use(handler);
  };

  route = (service: Service, resource: Resource): void => {
    const { route, endpoints } = routes(resource);
    const router = express.Router({ mergeParams: true });

    endpoints.forEach(({ endpoint, verb, requires }: Route) => {
      console.log(verb.verb.code, route.route(service.name));

      const middleware: RequestHandler[] = [];
      if (requires.token) middleware.push(checkToken());
      if (requires.scope) middleware.push(checkScope(requires.scope));
      if (requires.uc) middleware.push(checkUseCase(requires.uc));

      router[verb.verb.toString() as ExpressVerb](route.route(service.name), ...middleware, this.handle(endpoint, verb.options));
    });

    this.app.use(router);
  };

  listen = (port: number, message = `Service is listening on port ${port}.`): void => {
    this.app.listen(port, () => {
      console.log(message);
    });
  };
}

export const service = (name: string): Service => new Service(name, new ExpressProvider());
