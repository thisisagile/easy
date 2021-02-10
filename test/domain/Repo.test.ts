import { Dev, DevRoutedGateway, DevRepo } from '../ref';
import { fits, mock } from '@thisisagile/easy-test';
import { list, results } from '../../src';
import '@thisisagile/easy-test';

describe('Repo', () => {
  const devs = list(Dev.Sander.toJSON(), Dev.Jeroen.toJSON(), Dev.Naoufal.toJSON());
  let gateway: DevRoutedGateway;
  let repo: DevRepo;

  beforeEach(() => {
    gateway = new DevRoutedGateway();
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
    await expect(repo.byId(42)).rejects.toEqual(new Error('Does not exist'));
    expect(gateway.byId).toHaveBeenCalledWith(42);
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
    gateway.add = mock.reject(results('Wrong'));
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
    await expect(repo.update(Dev.Invalid.toJSON())).rejects.not.toBeValid();
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
});
