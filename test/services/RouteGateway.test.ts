import { Api, HttpStatus, RouteGateway, toRestResult } from "../../src";
import { Dev, DevRoutedGateway, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('RouteGateway', () => {
  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let api: Api;
  let gateway: RouteGateway;

  beforeEach(() => {
    api = new Api();
    gateway = new DevRoutedGateway(api);
  });

  test('all calls api correctly', async () => {
    api.get = mock.resolve(toRestResult(devs));
    const res = await gateway.all();
    expect(api.get).toHaveBeenCalledWith(DevUri.Developers);
    expect(res).toHaveLength(devs.length);
  });

  test('byId calls api correctly', async () => {
    api.get = mock.resolve(toRestResult(devs));
    const res = await gateway.byId(42);
    expect(api.get).toHaveBeenCalledWith(DevUri.Developer);
    expect(res).toMatchObject(devs[0]);
  });

  test('get calls api correctly with transform', async () => {
    api.get = mock.resolve({ payload: devs });
    const res = await new DevRoutedGateway(api).byName();
    expect(api.get).toHaveBeenCalledWith(DevUri.Developers, fits.any());
    expect(res).toBeTruthy();
  });

  test('exists calls api correctly', async () => {
    api.get = mock.resolve(toRestResult(devs[0]));
    await expect(gateway.exists(42)).resolves.toBe(true);
    expect(api.get).toHaveBeenCalledWith(DevUri.Developer.id(42));
  });

  test('exists returns false if more than one', async () => {
    api.get = mock.resolve(toRestResult(devs));
    await expect(gateway.exists(42)).resolves.toBe(false);
    expect(api.get).toHaveBeenCalledWith(DevUri.Developer.id(42));
  });

  test('exists returns false if not found', async () => {
    api.get = mock.reject(toRestResult(new Error('Does not exists'), HttpStatus.NotFound));
    await expect(gateway.exists(42)).resolves.toBe(false);
    expect(api.get).toHaveBeenCalledWith(DevUri.Developer.id(42));
  });

  test('exists rejects if other error', async () => {
    const r = toRestResult(new Error('Some other error'), HttpStatus.InternalServerError);
    api.get = mock.reject(r);
    await expect(gateway.exists(42)).rejects.toBe(r);
    expect(api.get).toHaveBeenCalledWith(DevUri.Developer.id(42));
  });

  test('add calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.post = mock.resolve(toRestResult(body));
    const res = await gateway.add(body);
    expect(api.post).toHaveBeenCalledWith(DevUri.Developers, body);
    expect(res).toMatchObject(body);
  });

  test('update calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.patch = mock.resolve(toRestResult(body));
    const res = await gateway.update(body);
    expect(api.patch).toHaveBeenCalledWith(DevUri.Developer, body);
    expect(res).toMatchObject(body);
  });

  test('delete calls api correctly', async () => {
    api.delete = mock.resolve(toRestResult(undefined, HttpStatus.NoContent));
    await gateway.remove(42);
    expect(api.delete).toHaveBeenCalledWith(DevUri.Developer.id(42));
  });
});
