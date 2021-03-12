import express, { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import { fits, mock } from '@thisisagile/easy-test';
import {
  Exception,
  ExpressProvider,
  ExpressVerb,
  Handler,
  HttpStatus,
  toBody,
  toExpressResponse,
  VerbOptions,
  ContentType,
  toJson,
  RestResult,
} from '../../src';
import * as exprProvider from '../../src/express/ExpressProvider';
import { DevResource, DevService, DevsResource, DevUri } from '../ref';
import passport from 'passport';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
type Endpoint = { path?: string; handler?: AsyncHandler };

//maybe this should be in easy-test:
const mockResponse = (): any =>
  (({
    json: mock.this(),
    status: mock.this(),
    end: mock.this(),
    set: mock.this(),
    type: mock.this(),
  } as unknown) as Response);

describe('ExpressProvider', () => {
  const app = ({ listen: mock.return(), use: mock.return(), set: mock.return() } as unknown) as Express;
  const handler: Handler = () => undefined;
  let provider: ExpressProvider;
  let service: DevService;
  let mockToBody: jest.SpyInstance;

  beforeEach(() => {
    provider = new ExpressProvider(app);
    service = new DevService('dev', provider);
    mockToBody = jest.spyOn(exprProvider, 'toBody');
  });

  afterEach(() => {
    mockToBody.mockRestore();
  });

  test('toBody with No Content', () => {
    expect(toBody(HttpStatus.NoContent, { not: 'used' })).toEqual({});
  });

  test('toBody with undefined', () => {
    expect(toJson(toBody(HttpStatus.Conflict, undefined))).toEqual(toJson({ data: { code: HttpStatus.Conflict.status, itemCount: 0, items: [] } }));
  });

  test('toBody with array', () => {
    const items = [{ foo: 'bar' }, { foo: 'baz' }];
    expect(toJson(toBody(HttpStatus.Ok, items))).toEqual(toJson({ data: { code: HttpStatus.Ok.status, itemCount: 2, items } }));
  });

  test('toExpressResponse Json, no OK status', () => {
    const res = mockResponse();
    const fakeRestResult: RestResult = {};
    mockToBody.mockReturnValue(fakeRestResult);
    const r = { foo: 'bar' };
    toExpressResponse(res, r, { type: ContentType.Json } as VerbOptions);
    expect(mockToBody).toHaveBeenCalledWith(HttpStatus.Ok, r);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Json.toString());
    expect(res.json).toHaveBeenCalledWith(fakeRestResult);
  });

  test('toExpressResponse Json, OK status', () => {
    const res = mockResponse();
    const fakeRestResult: RestResult = {};
    mockToBody.mockReturnValue(fakeRestResult);
    const r = { foo: 'bar' };
    toExpressResponse(res, r, { type: ContentType.Json, onOk: HttpStatus.Created } as VerbOptions);
    expect(mockToBody).toHaveBeenCalledWith(HttpStatus.Created, r);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Created.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Json.toString());
    expect(res.json).toHaveBeenCalledWith(fakeRestResult);
    expect(res.end).not.toHaveBeenCalled();
  });

  test('toExpressResponse with Stream', () => {
    const res = mockResponse();
    const fakeRestResult: RestResult = {};
    mockToBody.mockReturnValue(fakeRestResult);
    const buf = Buffer.from([]);
    toExpressResponse(res, buf, { type: ContentType.Stream } as VerbOptions);
    expect(mockToBody).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.Ok.status);
    expect(res.type).toHaveBeenCalledWith(ContentType.Stream.toString());
    expect(res.end).toHaveBeenCalledWith(buf);
    expect(res.json).not.toHaveBeenCalled();
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
    jest.spyOn(router, method).mockImplementationOnce((path: string, handler: RequestHandler) => cb({ path, handler: handler as AsyncHandler }));
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
    const res = mockResponse();

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
    const res = mockResponse();

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
    const res = mockResponse();

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
