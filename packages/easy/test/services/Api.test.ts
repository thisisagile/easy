import { Api, AxiosProvider, HttpStatus, HttpVerb, RequestOptions, toResponse } from '../../src';
import { Dev, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';
import { AxiosInstance } from 'axios';

describe('Api', () => {
  const devs = [Dev.Sander, Dev.Naoufal, Dev.Wouter];
  let axios: AxiosInstance;
  let provider: AxiosProvider, provider2: AxiosProvider;
  let api: Api, api2: Api;

  beforeEach(() => {
    axios = mock.an<AxiosInstance>({ request: mock.resolve({ status: 200, data: {} }) });
    provider = new AxiosProvider(axios);
    api = new Api(provider);
    provider2 = mock.an<AxiosProvider>({ execute: mock.resolve(toResponse(HttpStatus.Ok, devs)) });
    api2 = new Api(provider2);
  });

  test('get uri without page options', async () => {
    await api.get(DevUri.Developers);
    expect(axios.request).toHaveBeenCalledWith(fits.with({ url: DevUri.Developers.toString() }));
  });

  test('get uri with take', async () => {
    await api.get(DevUri.Developers, { take: 5 });
    expect(axios.request).toHaveBeenCalledWith(fits.with({ url: DevUri.Developers.take(5).toString() }));
  });

  test('get uri with skip', async () => {
    await api.get(DevUri.Developers, { skip: 10 });
    expect(axios.request).toHaveBeenCalledWith(fits.with({ url: DevUri.Developers.skip(10).toString() }));
  });

  test('get uri with take and skip', async () => {
    await api.get(DevUri.Developers, { take: 5, skip: 15 });
    expect(axios.request).toHaveBeenCalledWith(fits.with({ url: DevUri.Developers.skip(15).take(5).toString() }));
  });

  test('get uri with take and skip and RequestOptions', async () => {
    await api.get(DevUri.Developers, RequestOptions.Json.page({ take: 5, skip: 15 }));
    expect(axios.request).toHaveBeenCalledWith(fits.with({ url: DevUri.Developers.skip(15).take(5).toString() }));
  });

  test('get works', async () => {
    await api2.get(DevUri.Developers);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ options: fits.json(RequestOptions.Json) }));
  });

  test('checking options', async () => {
    api2.options = mock.return(RequestOptions.Form);
    await api2.get(DevUri.Developers);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ options: fits.json(RequestOptions.Form) }));
    expect(api2.options).toHaveBeenCalledWith(HttpVerb.Get, undefined);
  });

  test('get works with request options', async () => {
    await api2.get(DevUri.Developers, RequestOptions.Form);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ options: fits.json(RequestOptions.Form) }));
  });

  test('get works with page options', async () => {
    await api2.get(DevUri.Developers, { skip: 10, take: 5 });
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ options: fits.json(RequestOptions.Json) }));
  });

  test('get works with request & page options', async () => {
    const o = RequestOptions.Xml.page({ skip: 10, take: 5 });
    await api2.get(DevUri.Developers, o);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ options: fits.json(RequestOptions.Xml) }));
  });

  test('post works', async () => {
    const body = Dev.Sander.toJSON();
    await api2.post(DevUri.Developers, body);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ uri: fits.type(DevUri), verb: HttpVerb.Post, body }));
  });

  test('patch works', async () => {
    const body = Dev.Wouter.toJSON();
    await api2.patch(DevUri.Developer, body);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ uri: fits.type(DevUri), verb: HttpVerb.Patch, body }));
  });

  test('put works', async () => {
    const body = Dev.Jeroen.toJSON();
    await api2.put(DevUri.Developer, body);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ uri: fits.type(DevUri), verb: HttpVerb.Put, body }));
  });

  test('delete works', async () => {
    await api2.delete(DevUri.Developer);
    expect(provider2.execute).toHaveBeenCalledWith(fits.with({ uri: fits.type(DevUri), verb: HttpVerb.Delete }));
  });
});

// describe('types and validation', () => {
//   const str = () => 'hi';
//   const obj = <C>(c: Constructor<C>): C => new c();
//
//   const dev = { name: str(), language: str(), email: obj(Email) };
//   type Dev = typeof dev;
//
//   test('create type', () => {
//     const e: Dev = {};
//     const d: Dev = { name: 'Jan', language: 'NL' };
//     expect(d.name).toBe('Jan');
//   });
// });
//
