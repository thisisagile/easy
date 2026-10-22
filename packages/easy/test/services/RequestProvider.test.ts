import axios, { AxiosInstance } from 'axios';
import { AxiosProvider, ctx, EasyUri, FetchProvider, HttpStatus, HttpVerb, RequestInterceptor, RequestOptions, RequestProvider, uri } from '../../src';
import { DevUri } from '../ref';

type Transport = {
  provider: RequestProvider & { intercept: (...interceptors: RequestInterceptor[]) => unknown };
  request: jest.Mock;
  respond: (status: number, data?: unknown) => void;
  fail: (error: Error) => void;
  sent: () => { url: string; method: string; headers: Record<string, string>; body?: unknown };
};

const axiosTransport = (): Transport => {
  const request = jest.fn();
  const provider = new AxiosProvider({ request } as unknown as AxiosInstance);
  return {
    provider,
    request,
    respond: (status, data) => {
      const response = { status, data, statusText: status === 400 ? 'Bad Request' : 'Ok', headers: { 'x-test': 'present' } };
      request.mockImplementation(config => {
        const valid = config.validateStatus?.(status) ?? (status >= 200 && status < 300);
        return valid ? Promise.resolve(response) : Promise.reject({ response });
      });
    },
    fail: error => request.mockRejectedValue(error),
    sent: () => {
      const config = request.mock.calls[0][0];
      return { url: config.url, method: config.method, headers: config.headers, body: JSON.stringify(config.data) };
    },
  };
};

const fetchTransport = (): Transport => {
  const request = jest.fn();
  const provider = new FetchProvider(request as typeof fetch);
  return {
    provider,
    request,
    respond: (status, data) =>
      request.mockImplementation(() =>
        Promise.resolve(
          new globalThis.Response(data === undefined ? undefined : JSON.stringify(data), {
            status,
            headers: { 'content-type': 'application/json', 'x-test': 'present' },
          })
        )
      ),
    fail: error => request.mockRejectedValue(error),
    sent: () => {
      const [url, init] = request.mock.calls[0];
      return { url, method: init.method, headers: init.headers, body: init.body };
    },
  };
};

describe.each([
  ['AxiosProvider', axiosTransport],
  ['FetchProvider', fetchTransport],
])('%s RequestProvider contract', (_name, create) => {
  let transport: Transport;

  beforeEach(() => {
    transport = create();
  });

  afterEach(() => jest.restoreAllMocks());

  test('sends a GET and returns a normalized response', async () => {
    transport.respond(200, [{ name: 'Sander' }, { name: 'Wouter' }]);

    const response = await transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });

    expect(transport.sent()).toMatchObject({ url: DevUri.Developers.toString(), method: 'get' });
    expect(response.status).toBe(HttpStatus.Ok);
    expect(response.headers).toMatchObject({ 'x-test': 'present' });
    expect(response.body.data?.items).toHaveLength(2);
  });

  test('transforms successful response data', async () => {
    transport.respond(200, { dev: { name: 'Sander' } });

    const response = await transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, transform: data => data.dev });

    expect(response.body.data?.items[0]).toMatchObject({ name: 'Sander' });
  });

  test('sends encoded body and explicit headers', async () => {
    transport.respond(201, { saved: true });
    const options = RequestOptions.Json.bearer('special token');

    const response = await transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Post, body: { name: 'Sander' }, options });

    expect(transport.sent()).toMatchObject({ method: 'post', headers: { Authorization: 'Bearer special token' } });
    expect(JSON.parse(String(transport.sent().body))).toEqual({ name: 'Sander' });
    expect(response.status).toBe(HttpStatus.Created);
  });

  test('adds the context bearer only for internal URIs', async () => {
    class ExternalUri extends EasyUri {
      readonly host = uri.host('www.external.com');
    }
    jest.spyOn(ctx.request, 'jwt', 'get').mockReturnValue('token 42');
    transport.respond(200, {});

    await transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(transport.sent().headers.Authorization).toBe('Bearer token 42');

    transport.request.mockClear();
    await transport.provider.execute({ uri: new ExternalUri(), verb: HttpVerb.Get });
    expect(transport.sent().headers.Authorization).toBeUndefined();
  });

  test('turns a transport error into a response and applies transformError', async () => {
    transport.fail(new Error('network failed'));

    await expect(
      transport.provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        transformError: () => ({ message: 'translated error' }),
      })
    ).rejects.toMatchObject({ body: { error: { errors: [{ message: 'translated error' }] } } });
  });

  test('rejects HTTP errors as normalized responses', async () => {
    transport.respond(400, { error: { code: 400, errors: [{ message: 'invalid input' }] } });

    await expect(transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get })).rejects.toMatchObject({
      status: HttpStatus.BadRequest,
      body: { error: { code: 400, errors: [{ message: 'invalid input' }] } },
    });
  });

  test('uses the supplied status validator', async () => {
    transport.respond(400, { allowed: true });

    const response = await transport.provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Json.validateStatus(status => status === 400),
    });

    expect(response.status).toBe(HttpStatus.BadRequest);
    expect(response.body.data?.items[0]).toMatchObject({ allowed: true });
  });

  test('interceptors see the outgoing request and the raw response before transform', async () => {
    const interceptor = { request: jest.fn(), response: jest.fn(), error: jest.fn() };
    transport.provider.intercept(interceptor);
    transport.respond(200, { dev: { name: 'Sander' } });

    await transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Post, body: { name: 'Sander' }, transform: data => data.dev });

    expect(interceptor.request).toHaveBeenCalledWith(expect.objectContaining({ url: DevUri.Developers.toString(), method: 'post' }));
    expect(interceptor.response).toHaveBeenCalledWith(
      expect.objectContaining({ url: DevUri.Developers.toString(), status: 200, data: { dev: { name: 'Sander' } } })
    );
    expect(interceptor.error).not.toHaveBeenCalled();
  });

  test('interceptors see HTTP errors with status and raw body before transformError', async () => {
    const interceptor = { response: jest.fn(), error: jest.fn() };
    transport.provider.intercept(interceptor);
    transport.respond(404, { reason: 'gone' });

    await expect(transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, transformError: () => ({ message: 'x' }) })).rejects.toBeDefined();

    expect(interceptor.response).not.toHaveBeenCalled();
    expect(interceptor.error).toHaveBeenCalledWith(expect.objectContaining({ url: DevUri.Developers.toString(), status: 404, data: { reason: 'gone' } }));
  });

  test('interceptors see transport errors without a status', async () => {
    const error = new Error('network failed');
    const interceptor = { error: jest.fn() };
    transport.provider.intercept(interceptor);
    transport.fail(error);

    await expect(transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get })).rejects.toBeDefined();

    expect(interceptor.error).toHaveBeenCalledWith(expect.objectContaining({ status: undefined, error }));
  });

  test('a throwing interceptor fails the request instead of being swallowed', async () => {
    transport.provider.intercept({
      request: () => {
        throw new Error('logger broke');
      },
    });
    transport.respond(200, {});

    await expect(transport.provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get })).rejects.toThrow('logger broke');
    expect(transport.request).not.toHaveBeenCalled();
  });
});
