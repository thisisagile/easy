import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { AppProvider, Endpoint, HttpVerb, routes, toReq, toRestResult } from '../services';
import { Constructor } from '../types';

type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

const handle = (endpoint: Endpoint): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    endpoint(toReq(req)).then((r: any) => res.status(200).json(toRestResult(r))).catch(next);

export class ExpressProvider implements AppProvider {
  constructor(private app: Express = express()) {}

  listen = (port: number, message: string = `Service is listening on port ${port}.`) =>
    this.app.listen(port, () => { console.log(message); });

  use = (h: RequestHandler): void => {
    this.app.use(h);
  };

  route = (resource: Constructor) => {
    const { route, endpoints } = routes(resource);
    const router = express.Router({ mergeParams: true });

    endpoints.forEach(({ endpoint, verb }: { endpoint: Endpoint, verb: HttpVerb }) => {
      console.log(verb.code, route.path);
      router[verb.toString() as ExpressVerb](route.path, handle(endpoint));
    });

    this.use(router);
  };
}
