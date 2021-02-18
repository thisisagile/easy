import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { AppProvider, Endpoint, Handler, Resource, Route, routes, Service, toReq, toRestResult, VerbOptions } from '../services';
import { checkScope, checkToken, checkUseCase } from './SecurityHandler';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ExpressProvider implements AppProvider {
  constructor(private app: Express = express()) {
    this.app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  }

  use = (handler: Handler): void => {
    this.app.use(handler);
  };

  private static handle = (endpoint: Endpoint, options: VerbOptions): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req))
      .then((r: any) => res.status(options.onOk.status).json(toRestResult(r, options.onOk)))
      .catch(error => next({ error, options }));

  route = (service: Service, resource: Resource): void => {
    const { route, endpoints } = routes(resource);
    const router = express.Router({ mergeParams: true });

    endpoints.forEach(({ endpoint, verb, requires }: Route) => {
      console.log(verb.verb.code, route.route(service.name));

      const middleware: RequestHandler[] = [];
      if (requires.token) middleware.push(checkToken());
      if (requires.scope) middleware.push(checkScope(requires.scope));
      if (requires.uc) middleware.push(checkUseCase(requires.uc));

      router[verb.verb.toString() as ExpressVerb](route.route(service.name), ...middleware, ExpressProvider.handle(endpoint, verb.options));
    });

    this.app.use(router);
  };

  listen = (port: number, message = `Service is listening on port ${port}.`): void => {
    this.app.listen(port, () => {
      console.log(message);
    });
  };
}
