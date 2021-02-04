import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { AppProvider, Endpoint, Handler, Resource, routes, toReq, toRestResult, Verb, VerbOptions } from '../services';

export type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class ExpressProvider implements AppProvider {
  constructor(private app: Express = express()) {}

  use = (handler: Handler): void => {
    this.app.use(handler);
  };

  private static handle = (endpoint: Endpoint, options: VerbOptions): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req))
      .then((r: any) => res.status(options.onOk.status).json(toRestResult(r)))
      .catch(e => next(e));

  route = (resource: Resource): void => {
    const { route, endpoints } = routes(resource);
    const router = express.Router({ mergeParams: true });

    endpoints.forEach(({ endpoint, verb }: { endpoint: Endpoint; verb: Verb }) => {
      console.log(verb.verb.code, route.path);
      router[verb.verb.toString() as ExpressVerb](route.path, ExpressProvider.handle(endpoint, verb.options));
    });

    this.app.use(router);
  };

  listen = (port: number, message = `Service is listening on port ${port}.`): void => {
    this.app.listen(port, () => {
      console.log(message);
    });
  };
}
