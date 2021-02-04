import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { fits, mock } from '@thisisagile/easy-test';
import { ExpressProvider, ExpressVerb, Handler, HttpStatus } from '../../src';
import { DevsResource, DevUri } from '../ref';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type Endpoint = {path?: string, handler?: AsyncHandler};

describe('ExpressProvider', () => {
  const app = ({ listen: mock.return(), use: mock.return() } as unknown) as Express;
  const handler: Handler = () => undefined;
  let provider: ExpressProvider;

  beforeEach(() => {
    provider = new ExpressProvider(app);
  });

  test('use', () => {
    provider.use(handler);
    expect(app.use).toHaveBeenCalledWith(handler);
  });

  test('listen', () => {
    provider.listen(9001);
    expect(app.listen).toHaveBeenCalledWith(9001, fits.type(Function));
  });

  function mockRouterMethodOnce(router: express.Router, method: ExpressVerb, cb: (endpoint: Endpoint) => any) {
    jest.spyOn(router, method).mockImplementationOnce((path: string, handler: RequestHandler) => cb({path, handler: handler as AsyncHandler}));
  }

  test('route',  () => {
    const router = express.Router();
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    provider.route(DevsResource);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(router['get']).toEqual(fits.type(Function));
    expect(router['post']).toEqual(fits.type(Function));
  });


  test('check if handler works', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = {};
    const res: any = { status: mock.return({json: mock.return()}) };

    mockRouterMethodOnce(router, 'post', e => endpoint = e);
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.insert = mock.resolve();

    provider.route(resource);
    await endpoint.handler({} as Request, res as Response, jest.fn());

    expect(endpoint.path).toBe(DevUri.Developers.path);
    expect(resource.insert).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);

  });

  test('use options from decorator', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = {};
    const res: any = { status: mock.return({json: mock.return()}) };

    mockRouterMethodOnce(router, 'get', e => endpoint = e);
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.all = mock.resolve();

    provider.route(resource);
    await endpoint.handler({} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(HttpStatus.NoContent.status);

  });
});
