import { AxiosProvider, ctx, EasyUri, HttpStatus, HttpVerb, RequestOptions, uri } from '../../src';
import { DevUri } from '../ref';
import axios, { AxiosHeaders, AxiosInstance, AxiosResponse } from 'axios';
import { fits, mock } from '@thisisagile/easy-test';

describe('AxiosProvider', () => {
  const message = 'This is not right.';
  let provider: AxiosProvider;

  const asResponse = (status: HttpStatus, data: unknown): AxiosResponse => ({
    status: status.status,
    data,
    statusText: status.name,
    headers: {},
    config: {headers: new AxiosHeaders()},
  });

  const withErrorAndMessage = (code: HttpStatus, errorCount = 1, message?: string) =>
    fits.with({
      body: {
        error: fits.with({
          code: code.status,
          errorCount,
          errors: fits.with([{ domain: fits.any(), message, location: fits.any() }]),
          message: code.name,
        }),
      },
    });

  beforeEach(() => {
    provider = new AxiosProvider();
  });

  test('Simple get', async () => {
    axios.request = mock.resolve(asResponse(HttpStatus.Ok, { name: 'Sander' }));
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(axios.request).toHaveBeenCalledWith(
      fits.with({
        url: DevUri.Developers.toString(),
        method: HttpVerb.Get.id,
      })
    );
    expect(r.body.data?.items).toHaveLength(1);
  });

  test('Get with list', async () => {
    axios.request = mock.resolve(asResponse(HttpStatus.Ok, [{ name: 'Sander' }, { name: 'Wouter' }]));
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.body.data?.items).toHaveLength(2);
  });

  test('Get with transform', async () => {
    axios.request = mock.resolve(asResponse(HttpStatus.Ok, { dev: { name: 'Sander' } }));
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, transform: r => r.dev });
    expect(r.body.data?.items[0]).toMatchObject({ name: 'Sander' });
  });

  test('Get with reject and response', async () => {
    axios.request = mock.reject({ response: { statusText: message } });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
      })
    ).rejects.toEqual(withErrorAndMessage(HttpStatus.BadRequest, 1, message));
  });

  test('Get with reject and RestResult response', async () => {
    axios.request = mock.reject({ response: { data: { error: { code: 400, errors: [{ message }] } } } });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
      })
    ).rejects.toEqual(
      fits.with({
        body: {
          error: fits.with({
            code: 400,
            errorCount: 1,
            errors: fits.with([{ message: 'This is not right.' }]),
            message: 'Bad request',
          }),
        },
        headers: undefined,
        status: undefined,
      })
    );
  });

  test('Get with reject and request, should not have headers and status', async () => {
    axios.request = mock.reject({ request: { status: 400, message } });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
      })
    ).rejects.toMatchObject(withErrorAndMessage(HttpStatus.BadRequest, 1, message));
  });

  test('Get with reject and message', async () => {
    axios.request = mock.reject({ message });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
      })
    ).rejects.toEqual(withErrorAndMessage(HttpStatus.BadRequest, 1, message));
  });

  test('Get with reject and transform', async () => {
    axios.request = mock.reject({ message });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        transform: r => r.dev,
      })
    ).rejects.toEqual(withErrorAndMessage(HttpStatus.BadRequest, 1, message));
  });

  test('Get with reject and transform error', async () => {
    axios.request = mock.reject({ message });
    let res: any;
    await provider
      .execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        transform: r => r.dev,
        transformError: () => ({ message: 'This is not right' }),
      })
      .catch(r => (res = r));
    expect(res.body.error.errors[0].message).toBe('This is not right');
  });

  test('Get with reject and transform some external error', async () => {
    axios.request = mock.reject({ exception: 'Some external exception' });
    let res: any;
    await provider
      .execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        transform: r => r.dev,
        transformError: e => ({ message: e.exception }),
      })
      .catch(r => (res = r));
    expect(res.body.error.errors[0].message).toBe('Some external exception');
  });

  test('Request with headers and bearer', async () => {
    jest.spyOn(ctx.request, 'jwt', 'get').mockReturnValue('token 42');
    jest.spyOn(ctx.request, 'correlationId', 'get').mockReturnValue('4');
    axios.request = mock.resolve({ message });
    await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, options: RequestOptions.Xml });
    expect(axios.request).toHaveBeenCalledWith({
      url: DevUri.Developers.toString(),
      method: HttpVerb.Get.toString(),
      headers: RequestOptions.Xml.bearer('token 42').headers,
      data: RequestOptions.Xml.type.encode(undefined),
    });
  });

  test('Request to external service is done without bearer', async () => {
    class ExternalUri extends EasyUri {
      readonly host = uri.host('www.external.com');
    }

    const externalUri = new ExternalUri();

    jest.spyOn(ctx.request, 'jwt', 'get').mockReturnValue('token 42');
    jest.spyOn(ctx.request, 'correlationId', 'get').mockReturnValue('4');
    axios.request = mock.resolve({ message });
    await provider.execute({ uri: externalUri, verb: HttpVerb.Get, options: RequestOptions.Xml });
    expect(axios.request).toHaveBeenCalledWith({
      url: externalUri.toString(),
      method: HttpVerb.Get.toString(),
      headers: RequestOptions.Xml.headers,
      data: RequestOptions.Xml.type.encode(undefined),
    });
  });

  test('Request to internal service does not overwrite authorization', async () => {
    jest.spyOn(ctx.request, 'jwt', 'get').mockReturnValue('token 42');
    axios.request = mock.resolve({ message });

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Xml.bearer('special token'),
    });

    expect(axios.request).toHaveBeenCalledWith(fits.with({ headers: fits.with({ Authorization: 'Bearer special token' }) }));
  });

  test('axios could be replaced or extended', async () => {
    const mockedAxios = mock.a<AxiosInstance>({ request: mock.resolve({ message }) });
    provider = new AxiosProvider(mockedAxios);
    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
    });
    expect(mockedAxios.request).toHaveBeenCalled();
  });

  test('Pass requestOptions.maxRedirects to axios', async () => {
    axios.request = mock.resolve({ message });

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Xml.maxRedirects(42),
    });

    expect(axios.request).toHaveBeenCalledWith(fits.with({ maxRedirects: 42 }));
  });

  test('Pass requestOptions.validateStatus to axios', async () => {
    axios.request = mock.resolve({ message });
    const validate = Symbol() as unknown as () => boolean;

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Xml.validateStatus(validate),
    });

    expect(axios.request).toHaveBeenCalledWith(fits.with({ validateStatus: validate }));
    expect(Object.keys((axios.request as jest.Mock).mock.calls[0][0])).toContain('validateStatus');
    expect(Object.keys((axios.request as jest.Mock).mock.calls[0][0])).not.toContain('timeout');
  });

  test('Pass requestOptions.timeout to axios', async () => {
    axios.request = mock.resolve({ message });

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Xml.timeout('3m'),
    });

    expect(axios.request).toHaveBeenCalledWith(fits.with({ timeout: 180 * 1000 }));
    expect(Object.keys((axios.request as jest.Mock).mock.calls[0][0])).toContain('timeout');
  });

  test("Don't pass requestOptions.validateStatus to axios if undefined", async () => {
    axios.request = mock.resolve({ message });

    await provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get,
      options: RequestOptions.Xml.validateStatus(undefined),
    });

    expect(Object.keys((axios.request as jest.Mock).mock.calls[0][0])).not.toContain('validateStatus');
  });
});
