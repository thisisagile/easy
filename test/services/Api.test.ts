import { Api, HttpStatus, HttpVerb, RequestProvider, toRestResult } from '../../src';
import { Dev, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('Api', () => {
  const devs = [Dev.Sander, Dev.Naoufal, Dev.Wouter];
  const provider: RequestProvider = { execute: mock.resolve(toRestResult(devs, HttpStatus.Ok)) };
  let api: Api;

  beforeEach(() => {
    api = new Api(provider);
  });

  test('get works', async () => {
    await api.get(DevUri.Developers);
    expect(provider.execute).toHaveBeenCalledWith(fits.with({ uri: DevUri.Developers, verb: HttpVerb.Get }));
  });

  test('post works', async () => {
    const body = Dev.Sander.toJSON();
    await api.post(DevUri.Developers, body);
    expect(provider.execute).toHaveBeenCalledWith(fits.with({ uri: DevUri.Developers, verb: HttpVerb.Post, body }));
  });

  test('patch works', async () => {
    const body = Dev.Wouter.toJSON();
    await api.patch(DevUri.Developer, body);
    expect(provider.execute).toHaveBeenCalledWith(fits.with({ uri: DevUri.Developer, verb: HttpVerb.Patch, body }));
  });

  test('put works', async () => {
    const body = Dev.Jeroen.toJSON();
    await api.put(DevUri.Developer, body);
    expect(provider.execute).toHaveBeenCalledWith(fits.with({ uri: DevUri.Developer, verb: HttpVerb.Put, body }));
  });
  test('delete works', async () => {
    await api.delete(DevUri.Developer);
    expect(provider.execute).toHaveBeenCalledWith(fits.with({ uri: DevUri.Developer, verb: HttpVerb.Delete }));
  });
});
