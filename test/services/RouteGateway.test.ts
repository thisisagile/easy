import { Api, RouteGateway, toRestResult } from '../../src';
import { DevUri } from '../ref/DevUri';
import { Dev } from '../ref/Dev';
import { fits, mock } from '@thisisagile/easy-test';
import { DevGateway } from '../ref/DevGateway';

describe('RouteGateway', () => {

  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let api: Api;
  let gateway: RouteGateway;

  beforeEach(() => {
    api = new Api();
    gateway = new DevGateway(api);
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
    api.delete = mock.resolve(toRestResult());
    const res = await gateway.remove(42);
    expect(api.delete).toHaveBeenCalledWith(DevUri.Developer.id(42));
    expect(res).toBeTruthy();
  });

  test('get calls api correctly with transform', async () => {
    api.get = mock.resolve({ payload: devs });
    const res = await new DevGateway(api).byName();
    expect(api.get).toHaveBeenCalledWith(DevUri.Developers, fits.any());
    expect(res).toBeTruthy();
  });
});
