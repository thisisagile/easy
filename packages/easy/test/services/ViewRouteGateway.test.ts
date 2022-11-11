import { Api, HttpStatus, toResponse, View, ViewRouteGateway } from '../../src';
import { Dev, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('ViewRouteGateway', () => {
  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let views: { in: View; out: View };
  let api: Api;
  let gateway: ViewRouteGateway;

  beforeEach(() => {
    api = new Api();
    views = { in: mock.a<View>({ from: mock.return({}) }), out: mock.a<View>({ from: mock.return({}) }) };
    gateway = new ViewRouteGateway(
      () => DevUri.Developers,
      () => DevUri.Developer,
      views,
      api
    );
  });

  test('all calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    const res = await gateway.all();
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri), undefined);
    expect(views.in.from).toHaveBeenCalledTimes(devs.length);
    expect(res).toHaveLength(devs.length);
  });

  test('byId calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    const res = await gateway.byId(42);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri), undefined);
    expect(views.in.from).toHaveBeenCalledTimes(1);
    expect(res).toMatchObject({});
  });

  test('add calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.post = mock.resolve(toResponse(HttpStatus.Ok, body));
    const res = await gateway.add(body);
    expect(views.out.from).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith(fits.type(DevUri), {}, undefined);
    expect(res).toMatchObject(body);
  });

  test('update calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.patch = mock.resolve(toResponse(HttpStatus.Ok, body));
    const res = await gateway.update(body);
    expect(views.out.from).toHaveBeenCalledTimes(1);
    expect(api.patch).toHaveBeenCalledWith(fits.type(DevUri), {}, undefined);
    expect(res).toMatchObject(body);
  });
});
