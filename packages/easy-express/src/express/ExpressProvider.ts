import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { checkScope, checkToken, checkUseCase } from './SecurityHandler';
import {
  AppProvider,
  Endpoint,
  Handler,
  HttpStatus,
  Resource,
  rest,
  Route,
  routes,
  Service,
  toList,
  toOriginatedError,
  toReq,
  toVerbOptions,
  VerbOptions,
} from '@thisisagile/easy';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ExpressProvider implements AppProvider {
  constructor(protected app: Express = express()) {
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

  protected handle =
    (endpoint: Endpoint, options?: VerbOptions): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) =>
      endpoint(toReq(req))
        .then((r: any) => this.toResponse(res, r, toVerbOptions(options)))
        .catch(error => next(toOriginatedError(error, options)));

  protected toResponse(res: Response, result: unknown, options: Required<VerbOptions>): void {
    res.status(options.onOk.status);
    res.type(options.type.code);
    ((this as any)[options.type.name] ?? this.json)(res, result, options);
  }

  // Handling responses depending on content type

  protected json(res: Response, result: unknown, options: Required<VerbOptions>): void {
    if (HttpStatus.NoContent.equals(options.onOk)) {
      res.send();
    } else {
      res.json(rest.toData(options.onOk, toList<any>(result)));
    }
  }

  protected stream(res: Response, result: unknown): void {
    res.end(result);
  }
}

export const service = (name: string): Service => new Service(name, new ExpressProvider());
