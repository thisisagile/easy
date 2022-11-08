import { Dev, DevUri } from '../ref';
import { mock } from '@thisisagile/easy-test';
import { Exception, Json, RouteGateway, toList } from '../../src';
import '@thisisagile/easy-test';
import { developers, DevTypo, isDevType } from '../ref/DevTypo';

describe('Typo', () => {
  const devs = toList<Json>(Dev.Sander.toJSON(), Dev.Jeroen.toJSON());
  const views = [
    { name: 'Sander', level: '3', certificates: [42] },
    { name: 'Jeroen', level: '3', certificates: [42, 1] },
  ];
  let gateway: RouteGateway;
  let typo: DevTypo;

  beforeEach(() => {
    gateway = new RouteGateway(
      () => DevUri.Developers,
      () => DevUri.Developer
    );
    typo = new DevTypo(developers, gateway);
  });

  test('all triggers gateway', async () => {
    gateway.all = mock.resolve(devs);
    const ds = await typo.all();
    expect(gateway.all).toHaveBeenCalled();
    expect(ds[0]).toMatchJson(views[0]);
    expect(isDevType(ds.first())).toBeTruthy();
  });

  test('byId triggers gateway', async () => {
    gateway.byId = mock.resolve(devs.first());
    const d = await typo.byId(42);
    expect(gateway.byId).toHaveBeenCalledWith(42);
    expect(isDevType(d)).toBeTruthy();
    expect(d).toMatchJson(views[0]);
  });

  test('byId rejects if gateway returns undefined', async () => {
    gateway.byId = mock.resolve(undefined);
    await expect(typo.byId(42)).rejects.toMatchException(Exception.DoesNotExist);
    expect(gateway.byId).toHaveBeenCalledWith(42);
  });

  test('by triggers the gateway', async () => {
    gateway.by = mock.resolve(devs);
    const res = await typo.by('level', '42');
    expect(res[0]).toMatchJson(views[0]);
    expect(gateway.by).toHaveBeenCalledWith('level', '42', undefined);
  });

  test('byIds triggers gateway', async () => {
    gateway.byIds = mock.resolve(devs);
    const res = await typo.byIds(3, 1, 2);
    expect(res[0]).toMatchJson(views[0]);
    expect(gateway.byIds).toHaveBeenCalledWith(3, 1, 2);
  });

  test('byKey triggers the byId', async () => {
    gateway.by = mock.resolve(devs);
    const res = await typo.byKey(42);
    expect(res[0]).toMatchJson(views[0]);
    expect(gateway.by).toHaveBeenCalledWith('key', 42, undefined);
  });

  test('search triggers gateway', async () => {
    gateway.search = mock.resolve(devs);
    const res = await typo.search('Kim');
    expect(res[0]).toMatchJson(views[0]);
    expect(gateway.search).toHaveBeenCalledWith('Kim', undefined);
  });

  test('filter triggers gateway', async () => {
    gateway.filter = mock.resolve(devs);
    const res = await typo.filter({ filters: [] });
    expect(res[0]).toMatchJson(views[0]);
    expect(gateway.filter).toHaveBeenCalledWith({ filters: [] });
  });

  test('exists triggers gateway', async () => {
    gateway.exists = mock.resolve(true);
    const r = await typo.exists(42);
    expect(gateway.exists).toHaveBeenCalledWith(42);
    expect(r).toBeTruthy();
  });
});
