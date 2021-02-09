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

  test('get calls api correctly with transform', async () => {
    api.get = mock.resolve({ payload: devs });
    const res = await new DevRoutedGateway(api).byName();
    expect(api.get).toHaveBeenCalledWith(DevUri.Developers, fits.any());
    expect(res).toBeTruthy();
  });
});
