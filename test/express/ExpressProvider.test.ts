import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { fits, mock } from '@thisisagile/easy-test';
import { Exception, ExpressProvider, ExpressVerb, Handler, HttpStatus, VerbOptions, ContentType } from '../../src';
import { DevResource, DevService, DevsResource, DevUri } from '../ref';
import passport from 'passport';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type Endpoint = { path?: string; handler?: AsyncHandler };

class ExpressProviderTest extends ExpressProvider {
  toResponse(res: Response, result: unknown, options: VerbOptions): void {
    super.toResponse(res, result, options);
  }
}

describe('ExpressProvider', () => {
  const app = ({ listen: mock.return(), use: mock.return(), set: mock.return() } as unknown) as Express;
  const handler: Handler = () => undefined;
  let res: Response;
  let provider: ExpressProviderTest;
  let service: DevService;

  beforeEach(() => {
    provider = new ExpressProviderTest(app);
    service = new DevService('dev', provider);
    res = {json: mock.this(), end: mock.this(), type: mock.this(), status: mock.this()} as unknown as Response;
  });

  test('use', () => {
    provider.use(handler);
    expect(app.use).toHaveBeenCalledWith(handler);
  });

  test('listen', () => {
    provider.listen(9001);
    expect(app.listen).toHaveBeenCalledWith(9001, fits.type(Function));
  });

  test('toResponse without status and type', () => {
    const options: VerbOptions = {};
    (provider as any).json = mock.return();
    (provider as any).stream = mock.return();
    provider.toResponse(res, undefined, options);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Json.code);
    expect((provider as any).json).toHaveBeenCalledWith(res, undefined, options);
    expect((provider as any).stream).not.toHaveBeenCalled();
  });

  test('toResponse with status and type', () => {
    const result = {};
    const options: VerbOptions = {onOk: HttpStatus.Created, type: ContentType.Text};
    (provider as any).json = mock.return();
    provider.toResponse(res, result, options);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Text.code);
    expect((provider as any).json).toHaveBeenCalledWith(res, result, options);
  });

  test('toResponse with stream', () => {
    const buf =  Buffer.from([]);
    const options: VerbOptions = {type: ContentType.Stream};
    (provider as any).json = mock.return();
    (provider as any).stream = mock.return();
    provider.toResponse(res, buf, options);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Stream.code);
    expect((provider as any).json).not.toHaveBeenCalled();
    expect((provider as any).stream).toHaveBeenCalledWith(res, buf, options);
  });

  function mockRouterMethodOnce(router: express.Router, method: ExpressVerb, cb: (endpoint: Endpoint) => any) {
    jest.spyOn(router, method).mockImplementationOnce((path: string, handler: RequestHandler) =>
      cb({
        path,
        handler: handler as AsyncHandler,
      })
    );
  }

  test('route', () => {
    const router = express.Router();
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    provider.route(service, DevsResource);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(router['get']).toEqual(fits.type(Function));
    expect(router['post']).toEqual(fits.type(Function));
  });

  test('check if handler works', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = {};
    const res: any = { status: mock.return({ json: mock.return() }) };

    mockRouterMethodOnce(router, 'post', e => (endpoint = e));
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.insert = mock.resolve();

    provider.route(service, resource);
    await endpoint.handler({} as Request, res as Response, jest.fn());

    expect(endpoint.path).toBe(DevUri.Developers.path);
    expect(resource.insert).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);
  });

  test('use options from decorator', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = {};
    const res: any = { status: mock.this(), json: mock.this() };

    mockRouterMethodOnce(router, 'get', e => (endpoint = e));
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.all = mock.resolve();

    provider.route(service, resource);
    await endpoint.handler({} as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(HttpStatus.NoContent.status);
  });

  test('use security from decorator', () => {
    const authSpy = jest.spyOn(passport, 'authenticate');
    const resource = new DevResource();

    provider.route(service, resource);

    expect(authSpy).toHaveBeenCalledTimes(3);
  });

  test('Check rejected endpoint', async () => {
    const router = express.Router();
    const resource = new DevResource();
    let endpoint: Endpoint = {};
    const res: any = { status: mock.return({ json: mock.return() }) };

    mockRouterMethodOnce(router, 'delete', e => (endpoint = e));
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.delete = mock.reject(Exception.DoesNotExist);

    provider.route(service, resource);
    const next = mock.resolve();
    await endpoint.handler({} as Request, res as Response, next);

    expect(endpoint.path).toBe(DevUri.Developer.path);
    expect(resource.delete).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(fits.with({ origin: Exception.DoesNotExist }));
  });
});
