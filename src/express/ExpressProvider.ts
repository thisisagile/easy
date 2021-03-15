import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { checkScope, checkToken, checkUseCase } from './SecurityHandler';
import { toList } from '../types';
import { ContentType, HttpStatus, rest, toOriginatedError } from '../http';
import { AppProvider, Endpoint, Handler, Resource, Route, routes, Service, toReq, VerbOptions } from '../resources';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

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

  protected toResponse(res: Response, result: unknown, options: VerbOptions): void {
    res.status((options.onOk ?? HttpStatus.Ok).status);
    const contentType = options.type ?? ContentType.Json
    res.type(contentType.code);
    const f = (this as any)[contentType.name] ?? this.json;
    f(res, result, options);
  }

  protected handle = (endpoint: Endpoint, options: VerbOptions): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req))
      .then((r: any) => this.toResponse(res, r, options))
      .catch(error => next(toOriginatedError(error, options)));

  // Handling responses depending on content type

  protected json(res: Response, result: unknown, options: VerbOptions): void {
    if (!HttpStatus.NoContent.equals(options.onOk ?? HttpStatus.Ok)) {
      res.json(rest.toData(options.onOk ?? HttpStatus.Ok, toList<any>(result)));
    }
  }

  protected stream(res: Response, result: unknown, _options: VerbOptions): void {
    res.end(result);
  }
}

export const service = (name: string): Service => new Service(name, new ExpressProvider());
