import { Api, HttpStatus, RouteGateway, toResponse } from '../../src';
import { Dev, DevRoutedGateway, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('RouteGateway', () => {
  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let api: Api;
  let gateway: RouteGateway;

  beforeEach(() => {
    api = new Api();
    gateway = new DevRoutedGateway(DevUri.Developers, DevUri.Developer, api);
  });

  test('all calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    await expect(gateway.all()).resolves.toHaveLength(devs.length);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('byId calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    await expect(gateway.byId(42)).resolves.toMatchObject(devs[0]);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('search calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    await expect(gateway.search(42)).resolves.toHaveLength(devs.length);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('exists calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs[0]));
    await expect(gateway.exists(42)).resolves.toBe(true);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('exists returns false if more than one', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    await expect(gateway.exists(42)).resolves.toBe(false);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('exists returns false if not found', async () => {
    api.get = mock.reject(toResponse(HttpStatus.NotFound, {}, new Error('Does not exists')));
    await expect(gateway.exists(42)).resolves.toBe(false);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('exists rejects if other error', async () => {
    const r = toResponse(HttpStatus.InternalServerError, new Error('Some other error'));
    api.get = mock.reject(r);
    await expect(gateway.exists(42)).rejects.toBe(r);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
  });

  test('add calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.post = mock.resolve(toResponse(HttpStatus.Created, body));
    await expect(gateway.add(body)).resolves.toMatchObject(body);
    expect(api.post).toHaveBeenCalledWith(fits.type(DevUri), body);
  });

  test('update calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.patch = mock.resolve(toResponse(HttpStatus.Ok, body));
    await expect(gateway.update(body)).resolves.toMatchObject(body);
    expect(api.patch).toHaveBeenCalledWith(fits.type(DevUri), body);
  });

  test('upsert calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.put = mock.resolve(toResponse(HttpStatus.Ok, body));
    await expect(gateway.upsert(body)).resolves.toMatchObject(body);
    expect(api.put).toHaveBeenCalledWith(fits.type(DevUri), body);
  });

  test('delete calls api correctly', async () => {
    api.delete = mock.resolve(toResponse(HttpStatus.NoContent));
    await gateway.remove(42);
    expect(api.delete).toHaveBeenCalledWith(fits.type(DevUri));
  });
});
