import { Api, HttpStatus, Map, MappedRouteGateway, toResponse } from '../../src';
import { Dev, DevUri, MappedDevGateway } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('MappedRouteGateway', () => {
  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let map: Map;
  let api: Api;
  let gateway: MappedRouteGateway;

  beforeEach(() => {
    api = new Api();
    map = new Map();
    gateway = new MappedDevGateway(DevUri.Developers, DevUri.Developer, map, api);
  });

  test('all calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    map.in = mock.impl(a => a);
    const res = await gateway.all();
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
    expect(map.in).toHaveBeenCalledTimes(devs.length);
    expect(res).toHaveLength(devs.length);
  });

  test('byId calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    map.in = mock.impl(a => a);
    const res = await gateway.byId(42);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri));
    expect(map.in).toHaveBeenCalledTimes(1);
    expect(res).toMatchObject(devs[0]);
  });

  test('add calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    map.out = mock.impl(a => a);
    api.post = mock.resolve(toResponse(HttpStatus.Ok, body));
    const res = await gateway.add(body);
    expect(map.out).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(fits.type(DevUri), body);
    expect(res).toMatchObject(body);
  });

  test('update calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    map.out = mock.impl(a => a);
    api.patch = mock.resolve(toResponse(HttpStatus.Ok, body));
    const res = await gateway.update(body);
    expect(map.out).toHaveBeenCalledTimes(1);
    expect(api.patch).toHaveBeenCalledWith(fits.type(DevUri), body);
    expect(res).toMatchObject(body);
  });
});
