import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { checkScope, checkToken, checkUseCase } from './SecurityHandler';
import { choose } from '../utils';
import { isDefined, toList } from '../types';
import { HttpStatus, rest, RestResult, toOriginatedError } from '../http';
import { AppProvider, Endpoint, Handler, Resource, Route, routes, Service, toReq, VerbOptions } from '../resources';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

const toBody = (status: HttpStatus, outcome?: unknown): RestResult =>
  choose<RestResult, any>(outcome)
    .case(() => HttpStatus.NoContent.equals(status), undefined)
    .case(
      o => !isDefined(o),
      () => rest.toData(status, []),
    )
    .else(o => rest.toData(status, toList(o)));

// const toResponse = (res: Response, result?: unknown, options?: VerbOptions) => {
//   res.status(options.onOk.status).type(options.type.id.toString());
//
//   choose<void, ContentType>(options.type)
//     .case(
//       ct => ContentType.Json.equals(ct),
//       () => res.json(toBody(options.onOk, result))
//     )
//     .case(
//       ct => ContentType.Stream.equals(ct),
//       () => res.end(result)
//     );
// };

export class ExpressProvider implements AppProvider {
  constructor(private app: Express = express()) {
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

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

  protected toResponse = (res: Response, result: unknown, options: VerbOptions): void => {
    res.status(options.onOk.status).type(options.type.code);
    const f = (this as any)[options.type.name] ?? this.json;
    f(res, result, options);
  };

  protected handle = (endpoint: Endpoint, options: VerbOptions): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req))
      .then((r: any) => this.toResponse(res, r, options))
      .catch(error => next(toOriginatedError(error, options)));

  // Handling responses depending on content type

  protected json(res: Response, result: unknown, options: VerbOptions): void {
    res.json(toBody(options.onOk, result));
  }

  protected stream(res: Response, result: unknown): void {
    res.end(result);
  }
}

export const service = (name: string): Service => new Service(name, new ExpressProvider());
