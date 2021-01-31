import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { AppProvider, Endpoint, Handler, HttpVerb, Resource, routes, toReq, toRestResult } from '../services';
import { ctx } from '../types';
import { correlationHeader } from './CorrelationHandler';

type ExpressVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

const handle = (endpoint: Endpoint): RequestHandler => (req: Request, res: Response, next: NextFunction) =>
  endpoint(toReq(req))
    .then((r: any) => {
      res.setHeader(correlationHeader, ctx.request.correlationId);
      res.status(200).json(toRestResult(r));
    })
    .catch(next);

export class ExpressProvider implements AppProvider {
  constructor(private app: Express = express()) {}

  use = (handler: Handler): void => {
    this.app.use(handler);
  };

  route = (resource: Resource): void => {
    const { route, endpoints } = routes(resource);
    const router = express.Router({ mergeParams: true });

    endpoints.forEach(({ endpoint, verb }: { endpoint: Endpoint; verb: HttpVerb }) => {
      console.log(verb.code, route.path);
      router[verb.toString() as ExpressVerb](route.path, handle(endpoint));
    });

    this.app.use(router);
  };

  listen = (port: number, message = `Service is listening on port ${port}.`): void => {
    this.app.listen(port, () => {
      console.log(message);
    });
  };
}
