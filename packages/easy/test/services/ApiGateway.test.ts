import { Api, ApiGateway, cache, EasyUri, Func, HttpStatus, Request, RequestOptions, Response, RouteGateway, Store, toList, toResponse, uri } from '../../src';
import { Dev, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';

describe('ApiGateway', () => {
  const devs = [Dev.Sander.toJSON(), Dev.Naoufal.toJSON(), Dev.Wouter.toJSON()];
  let api: Api;
  let gateway: ApiGateway;

  beforeEach(() => {
    api = new Api();
    gateway = new ApiGateway(api);
  });

  test('get calls api correctly', async () => {
    api.get = mock.resolve(toResponse(HttpStatus.Ok, devs));
    await expect(gateway.get(DevUri.Developers, mock.a<RequestOptions>({}))).resolves.toHaveLength(devs.length);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri), {});
  });

  test('get calls api correctly with an empty body', async () => {
    api.get = mock.resolve({ body: {} });
    await expect(gateway.get(DevUri.Developers, mock.a<RequestOptions>({}))).resolves.toHaveLength(0);
  });

  const filters = [{ field: 'A', values: [{ value: 1 }, { value: 2 }] }];
  const sorts = ['alpha-asc', 'alpha-desc'];

  test('get calls api correctly with options (but missing sorts)', async () => {
    api.get = mock.resolve({ body: {data: { totalItems: 42, items: [{id: 1, name: 'Sander'}], meta: { filters, sorts, skip: 0, take: 250  }}}});
    const pl = await gateway.get(DevUri.Developers, {skip: 0, take: 5});
    expect(pl).toHaveLength(1);
    expect(pl[0].name).toBe('Sander');
    expect(pl.total).toBe(42);
    expect(pl.skip).toBe(0);
    expect(pl.take).toBe(250);
    expect(pl.filters).toStrictEqual(filters);
    // expect(pl.sorts).toStrictEqual(sorts);
  });

  test('post calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.post = mock.resolve(toResponse(HttpStatus.Created, body));
    await expect(gateway.post(DevUri.Developers, body)).resolves.toMatchObject(body);
    expect(api.post).toHaveBeenCalledWith(fits.type(DevUri), body, undefined);
  });

  test('post calls api correctly with different Uri', async () => {
    class StatsUri extends EasyUri {
      static readonly stats = uri.segment('stats');
      static get Stats(): StatsUri {
        return new StatsUri([StatsUri.stats]);
      }
    }

    const body = Dev.Sander.toJSON();
    api.post = mock.resolve(toResponse(HttpStatus.Created, body));
    await expect(gateway.post(StatsUri.Stats, {})).resolves.toBeDefined();
    expect(api.post).toHaveBeenCalledWith(fits.type(StatsUri), {}, undefined);
  });

  test('postSearch calls api correctly', async () => {
    api.post = mock.resolve(toResponse(HttpStatus.Created, devs));
    await expect(gateway.postSearch(DevUri.Developers, mock.a<RequestOptions>({}))).resolves.toHaveLength(devs.length);
    expect(api.post).toHaveBeenCalledWith(fits.type(DevUri), {});
  });

  test('patch calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.patch = mock.resolve(toResponse(HttpStatus.Ok, body));
    await expect(gateway.patch(DevUri.Developer.id(42), body)).resolves.toMatchObject(body);
    expect(api.patch).toHaveBeenCalledWith(fits.type(DevUri), body, undefined);
  });

  test('put calls api correctly', async () => {
    const body = Dev.Sander.toJSON();
    api.put = mock.resolve(toResponse(HttpStatus.Ok, body));
    await expect(gateway.put(DevUri.Developer.id(42), body)).resolves.toMatchObject(body);
    expect(api.put).toHaveBeenCalledWith(fits.type(DevUri), body, undefined);
  });

  test('delete calls api correctly', async () => {
    api.delete = mock.resolve(toResponse(HttpStatus.NoContent));
    await gateway.delete(DevUri.Developer.id(42));
    expect(api.delete).toHaveBeenCalledWith(fits.type(DevUri), undefined);
  });

  test('pass options into get call', async () => {
    api.get = mock.resolve(mock.resp.items(HttpStatus.Ok, toList()));
    await gateway.get(DevUri.Developers, RequestOptions.Text);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri), fits.type(RequestOptions));
  });

  test('pass options into getOne call', async () => {
    api.get = mock.resolve(mock.resp.items(HttpStatus.Ok, toList()));
    await gateway.getOne(DevUri.Developer.id(42), RequestOptions.Text);
    expect(api.get).toHaveBeenCalledWith(fits.type(DevUri), fits.type(RequestOptions));
  });

  class TestStore implements Store<Response, Request> {
    execute(req: Request, f: Func<Promise<Response>, Request>): Promise<Response> {
      return f(req);
    }
  }

  @cache({ expiresIn: '1d', store: TestStore })
  class TestGateway extends RouteGateway {
    constructor(api: Api) {
      super(
        () => DevUri.Developers,
        () => DevUri.Developer,
        api
      );
    }
  }
});
