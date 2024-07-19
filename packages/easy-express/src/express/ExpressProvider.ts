import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { checkLabCoat, checkScope, checkToken, checkUseCase } from './SecurityHandler';
import { HttpStatus, isEmpty, PageList, rest, toList, toReq } from '@thisisagile/easy';
import {
  AppProvider,
  Endpoint,
  Handler,
  Resource,
  Route,
  RouteRequires,
  routes,
  Service,
  toOriginatedError,
  toVerbOptions,
  VerbOptions,
} from '@thisisagile/easy-service';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ExpressProvider implements AppProvider {
  constructor(protected app: Express = express()) {
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

  use = (handler: Handler): void => {
    this.app.use(handler);
  };

  route = (service: Service, resource: Resource): void => {
    const { route, endpoints, middleware } = routes(resource);
    const router = express.Router({ mergeParams: true });
    if (!isEmpty(middleware)) router.all(route.route(service.name), middleware);

    endpoints.forEach(({ endpoint, verb, requires, middleware }: Route) => {
      console.log(verb.verb.code, route.route(service.name));
      router[verb.verb.toString() as ExpressVerb](
        route.route(service.name),
        ...this.addSecurityMiddleware(requires),
        ...middleware,
        this.handle(endpoint, verb.options, requires)
      );
    });

    this.app.use(router);
  };

  listen = (port: number, message = `Service is listening on port ${port}.`): void => {
    this.app.listen(port, () => {
      console.log(message);
    });
  };

  protected addSecurityMiddleware(requires: RouteRequires): RequestHandler[] {
    const middleware: RequestHandler[] = [];
    if (requires.labCoat) middleware.push(checkLabCoat());
    if (requires.token) middleware.push(checkToken());
    if (requires.scope) middleware.push(checkScope(requires.scope));
    if (requires.uc) middleware.push(checkUseCase(requires.uc));
    return middleware;
  }

  protected handle =
    (endpoint: Endpoint, options?: VerbOptions, requires?: RouteRequires): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) =>
      endpoint(toReq(req))
        .then((r: any) => this.toResponse(res, r, toVerbOptions(options)))
        .catch(error => next(toOriginatedError(error, options)));

  protected toResponse(res: Response, result: unknown, options: Required<VerbOptions>): void {
    res.status(options.onOk.status);
    res.type(options.type.code);
    if (options.cache.enabled) res.setHeader(options.cache.name, options.cache.value());

    ((this as any)[options.type.name] ?? this.json)(res, result, options);
  }

  // Handling responses depending on content type

  protected json(res: Response, result: unknown, options: Required<VerbOptions>): void {
    if (HttpStatus.NoContent.equals(options.onOk)) {
      res.send();
    } else {
      res.json(rest.toData(options.onOk, toList<any>(result), (result as PageList<any>)?.total, (result as PageList<any>)?.meta));
    }
  }

  protected stream(res: Response, result: unknown): void {
    res.end(result);
  }

  protected text(res: Response, data: unknown): void {
    res.send(data);
  }
}

export const service = (name: string): Service => new Service(name, new ExpressProvider());
