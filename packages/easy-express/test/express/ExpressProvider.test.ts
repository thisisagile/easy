import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { fits, mock } from '@thisisagile/easy-test';
import { CacheControl, ContentType, Exception, HttpStatus } from '@thisisagile/easy';
import { DevResource, DevService, DevsResource, DevUri } from '../ref';
import passport from 'passport';
import { ExpressProvider, ExpressVerb } from '../../src';
import { Handler, toVerbOptions, VerbOptions } from '@thisisagile/easy-service';

type PathParams = string | RegExp | Array<string | RegExp>;
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type Endpoint = { path?: PathParams; handler: AsyncHandler };

class ExpressProviderTest extends ExpressProvider {
  toResponse(res: Response, result: unknown, options: VerbOptions): void {
    super.toResponse(res, result, toVerbOptions(options));
  }
}

describe('ExpressProvider', () => {
  const app = { listen: mock.return(), use: mock.return(), set: mock.return() } as unknown as Express;
  const handler: Handler = () => undefined;
  let res: Response;
  let provider: ExpressProviderTest;
  let service: DevService;

  beforeEach(() => {
    provider = new ExpressProviderTest(app);
    service = new DevService('dev', provider);
    res = {
      json: mock.this(),
      end: mock.this(),
      type: mock.this(),
      status: mock.this(),
      send: mock.this(),
      setHeader: mock.this(),
    } as unknown as Response;
    console.log = mock.return();
  });

  test('use', () => {
    provider.use(handler);
    expect(app.use).toHaveBeenCalledWith(handler);
  });

  test('listen', () => {
    provider.listen(9001);
    expect(app.listen).toHaveBeenCalledWith(9001, fits.type(Function));
  });

  test('toResponse without status, type and cache-control', () => {
    const cc = mock.empty<CacheControl>({ enabled: false });
    const options: VerbOptions = { cache: cc };
    (provider as any).json = mock.return();
    (provider as any).stream = mock.return();
    provider.toResponse(res, undefined, options);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Json.code);
    expect((provider as any).json).toHaveBeenCalledWith(res, undefined, toVerbOptions(options));
    expect((provider as any).stream).not.toHaveBeenCalled();
  });

  test('toResponse with status and type', () => {
    const result = {};
    const cc = mock.empty<CacheControl>({ enabled: false });
    const options: VerbOptions = { onOk: HttpStatus.Created, type: ContentType.Form, cache: cc };
    (provider as any).json = mock.return();
    provider.toResponse(res, result, options);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Form.code);
    expect((provider as any).json).toHaveBeenCalledWith(res, result, toVerbOptions(options));
  });

  test('toResponse calls cache set header', () => {
    const result = {};
    const cc = mock.empty<CacheControl>({ name: 'Cache-Control', enabled: true });
    cc.value = mock.return('max-age=1');
    const options: VerbOptions = { cache: cc };
    (provider as any).json = mock.return();
    provider.toResponse(res, result, options);
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'max-age=1');
  });

  test('toResponse with stream', () => {
    const buf = Buffer.from([]);
    const cc = mock.empty<CacheControl>({ enabled: false });
    const options: VerbOptions = { type: ContentType.Stream, cache: cc };
    (provider as any).json = mock.return();
    provider.toResponse(res, buf, options);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Stream.code);
    expect((provider as any).json).not.toHaveBeenCalled();
    expect(res.end).toHaveBeenCalledWith(buf);
  });

  test('toResponse with text', () => {
    provider.toResponse(res, 'foo', { type: ContentType.Text });
    expect(res.send).toHaveBeenCalledWith('foo');
    expect(res.type).toHaveBeenCalledWith(ContentType.Text.code);
  });

  function mockRouterMethodOnce(router: express.Router, method: ExpressVerb, cb: (endpoint: Endpoint) => any) {
    jest.spyOn(router, method).mockImplementationOnce((path: PathParams, handler: RequestHandler) =>
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

  test('resource middleware is added', () => {
    const router = express.Router();
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    router.all = mock.return();
    provider.route(service, DevsResource);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(router.all).toHaveBeenCalledWith('/dev/developers', expect.arrayContaining([fits.type(Function)]));
    expect(router['get']).toEqual(fits.type(Function));
    expect(router['post']).toEqual(fits.type(Function));
  });

  test('verd middleware is added', () => {
    const router = express.Router();
    const resource = new DevResource();
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    const get = jest.spyOn(router, 'get');
    provider.route(service, resource);
    expect(app.use).toHaveBeenCalledWith(router);
    expect(get).toHaveBeenNthCalledWith(1, '/dev/developers/:id', fits.type(Function), fits.type(Function), fits.type(Function), fits.type(Function));
  });

  test('check if handler works', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = { handler: mock.empty<AsyncHandler>() };
    const res: any = { status: mock.return({ json: mock.return() }) };

    mockRouterMethodOnce(router, 'post', e => (endpoint = e));
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.insert = mock.resolve();

    provider.route(service, resource);
    await endpoint.handler({ body: { hello: 'World' } } as Request, res as Response, jest.fn());

    expect(endpoint.path).toBe(DevUri.Developers.path);
    expect(resource.insert).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);
  });

  test('route passes security to handler', () => {
    const router = express.Router();
    const resource = new DevsResource();
    mockRouterMethodOnce(router, 'get', mock.return());
    mockRouterMethodOnce(router, 'post', mock.return());
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    (provider as any).handle = mock.return();
    provider.route(service, resource);

    expect((provider as any).handle).toHaveBeenCalledWith(fits.any(), fits.any(), fits.with({ token: false, uc: undefined }));
  });

  test('start with log of resources', async () => {
    const resource = new DevsResource();
    provider.route(service, resource);
    expect(console.log).toHaveBeenNthCalledWith(1, 'GET', '/dev/developers');
    expect(console.log).toHaveBeenNthCalledWith(2, 'POST', '/dev/developers');
  });

  test('use options from decorator', async () => {
    const router = express.Router();
    const resource = new DevsResource();
    let endpoint: Endpoint = { handler: mock.empty<AsyncHandler>() };
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
    let endpoint: Endpoint = { handler: mock.empty<AsyncHandler>() };
    const res: any = { status: mock.return({ json: mock.return() }) };

    mockRouterMethodOnce(router, 'post', e => (endpoint = e));
    jest.spyOn(express, 'Router').mockReturnValueOnce(router);
    resource.post = mock.reject(Exception.IsNotValid);

    provider.route(service, resource);
    const next = mock.resolve();
    await endpoint.handler({} as Request, res as Response, next);

    expect(endpoint.path).toBe(DevUri.Developer.path);
    expect(resource.post).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(fits.with({ origin: Exception.IsNotValid }));
  });
});
