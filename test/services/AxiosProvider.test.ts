import { AxiosProvider, HttpStatus, HttpVerb } from '../../src';
import { DevUri } from '../ref';
import axios, { AxiosResponse } from 'axios';
import { fits, mock } from '@thisisagile/easy-test';

describe('AxiosProvider', () => {
  const message = 'This is not right.';
  let provider: AxiosProvider;

  const asResponse = (status: HttpStatus, data: unknown): AxiosResponse => ({
    status: status.status,
    data,
    statusText: status.name,
    headers: {},
    config: {},
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
    axios.request = mock.reject({ response: { data: { error: { errors: [{ message }] } } } });
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
    ).rejects.toEqual(withErrorAndMessage(HttpStatus.InternalServerError, 1, message));
  });

  test('Get with reject and transform', async () => {
    axios.request = mock.reject({ message });
    return expect(
      provider.execute({
        uri: DevUri.Developers,
        verb: HttpVerb.Get,
        transform: r => r.dev,
      })
    ).rejects.toEqual(withErrorAndMessage(HttpStatus.InternalServerError, 1, message));
  });
});
