import { Dev, DevRepo, DevRoutedGateway, DevUri } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';
import { Exception, Json, list, toList, toResults } from '../../src';
import '@thisisagile/easy-test';

describe('Repo', () => {
  const devs = list<Json>(Dev.Sander.toJSON(), Dev.Jeroen.toJSON(), Dev.Naoufal.toJSON());
  let gateway: DevRoutedGateway;
  let repo: DevRepo;

  beforeEach(() => {
    gateway = new DevRoutedGateway(DevUri.Developers, DevUri.Developer);
    repo = new DevRepo(gateway);
  });

  test('all triggers gateway', async () => {
    gateway.all = mock.resolve(devs);
    const ds = await repo.all();
    expect(gateway.all).toHaveBeenCalled();
    expect(ds).toBeArrayOfWithLength(Dev, devs.length);
  });

  test('byId triggers gateway', async () => {
    gateway.byId = mock.resolve(devs.first());
    const d = await repo.byId(42);
    expect(gateway.byId).toHaveBeenCalledWith(42);
    expect(d).toBeInstanceOf(Dev);
    expect(d).toMatchObject(devs.first());
  });

  test('byId rejects if gateway returns undefined', async () => {
    gateway.byId = mock.resolve(undefined);
    await expect(repo.byId(42)).rejects.toMatchException(Exception.DoesNotExist);
    expect(gateway.byId).toHaveBeenCalledWith(42);
  });

  test('by triggers the gateway', async () => {
    gateway.by = mock.resolve(toList(Dev.Naoufal));
    const res = await repo.by('level', '42');
    expect(res.toJSON()).toMatchObject(toList(Dev.Naoufal).toJSON());
    expect(gateway.by).toHaveBeenCalledWith('level', '42');
  });

  test('search triggers gateway', async () => {
    gateway.search = mock.resolve(devs);
    const ds = await repo.search('Kim');
    expect(gateway.search).toHaveBeenCalledWith('Kim');
    expect(ds).toBeArrayOfWithLength(Dev, devs.length);
  });

  test('exists triggers gateway', async () => {
    gateway.exists = mock.resolve(true);
    const r = await repo.exists(42);
    expect(gateway.exists).toHaveBeenCalledWith(42);
    expect(r).toBeTruthy();
  });

  test('remove triggers gateway', async () => {
    gateway.remove = mock.resolve(true);
    await expect(repo.remove(42)).resolves.toBeTruthy();
    expect(gateway.remove).toHaveBeenCalledWith(42);
  });

  test('add invalid object does not trigger gateway', async () => {
    gateway.add = mock.resolve({});
    await expect(repo.add(Dev.Invalid.toJSON())).rejects.not.toBeValid();
    return expect(gateway.add).not.toHaveBeenCalled();
  });

  test('add valid object but fails in repo should not trigger gateway', async () => {
    gateway.add = mock.resolve({});
    await expect(repo.add(Dev.Naoufal.toJSON())).rejects.not.toBeValid();
    return expect(gateway.add).not.toHaveBeenCalled();
  });

  test('add valid object but gateway fails trigger gateway', async () => {
    gateway.add = mock.reject(toResults('Wrong'));
    await expect(repo.add(Dev.Jeroen.toJSON())).rejects.not.toBeValid();
    return expect(gateway.add).toHaveBeenCalled();
  });

  test('add valid object does trigger gateway', async () => {
    gateway.add = mock.resolve(Dev.Jeroen.toJSON());
    await expect(repo.add(Dev.Jeroen.toJSON())).resolves.toBeValid();
    return expect(gateway.add).toHaveBeenCalled();
  });

  test('update where object is not found does not trigger gateway', async () => {
    gateway.byId = mock.resolve();
    gateway.update = mock.resolve();
    await expect(repo.update(Dev.Invalid.toJSON())).rejects.toMatchException(Exception.DoesNotExist);
    return expect(gateway.update).not.toHaveBeenCalled();
  });

  test('update where new object is invalid does not trigger gateway', async () => {
    gateway.byId = mock.resolve({ id: 43 });
    gateway.update = mock.resolve();
    await expect(repo.update(Dev.Invalid.toJSON())).rejects.not.toBeValid();
    return expect(gateway.update).not.toHaveBeenCalled();
  });

  test('Dev update works', () => {
    expect(Dev.Sander.update({ level: 4 })).toMatchObject(fits.with({ level: 4 }));
  });

  test('update where gateway fails is not valid', async () => {
    gateway.byId = mock.resolve(Dev.Sander.toJSON());
    gateway.update = mock.reject();
    await expect(repo.update({ id: 43, level: 4 })).rejects.not.toBeValid();
    return expect(gateway.update).toHaveBeenCalledWith(fits.with({ id: 3, level: 4 }));
  });

  test('update where gateway succeeds is valid', async () => {
    const update = { level: 4, language: 'C#' };
    gateway.byId = mock.resolve(Dev.Sander.toJSON());
    gateway.update = mock.resolve(Dev.Sander.update(update).toJSON());
    await expect(repo.update(update)).resolves.toMatchObject(fits.with(update));
    return expect(gateway.update).toHaveBeenCalledWith(fits.with(update));
  });

  test('Upsert should update', async () => {
    const update = { level: 4, language: 'COBOL' };
    gateway.byId = mock.resolve(Dev.Jeroen.toJSON());
    gateway.update = mock.resolve(Dev.Jeroen.update(update).toJSON());
    repo.add = mock.resolve();
    await expect(repo.upsert(update)).resolves.toMatchObject(fits.with(update));
    expect(repo.add).not.toHaveBeenCalled();
  });

  test('Upsert should add, when update fails', async () => {
    const update = { level: 4, language: 'COBOL' };
    repo.update = mock.reject(Exception.Unknown);
    repo.add = mock.resolve(update);
    await expect(repo.upsert(update)).resolves.toMatchObject(fits.with(update));
    expect(repo.add).toHaveBeenCalledWith(fits.with(update));
  });
});
