import { Search, toList } from '../../src';
import { Dev, DevRepo } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Search', () => {
  const devs = toList(Dev.Sander, Dev.Jeroen, Dev.Naoufal);
  const repo = new DevRepo();
  let select: Search<Dev>;

  beforeEach(() => {
    select = new Search<Dev>(repo);
  });

  test('all works', async () => {
    repo.all = mock.resolve(devs);
    await expect(select.all()).resolves.toStrictEqual(devs);
    expect(repo.all).toHaveBeenCalled();
  });

  test('byId works', async () => {
    repo.byId = mock.resolve(devs.first());
    await expect(select.byId(42)).resolves.toStrictEqual(devs.first());
    expect(repo.byId).toHaveBeenCalledWith(42);
  });

  test('byKey works', async () => {
    repo.byKey = mock.resolve(devs);
    await expect(select.byKey(42)).resolves.toStrictEqual(devs);
    expect(repo.byKey).toHaveBeenCalledWith(42, undefined);
  });

  test('search works', async () => {
    repo.search = mock.resolve(devs);
    await expect(select.search(42)).resolves.toStrictEqual(devs);
    expect(repo.search).toHaveBeenCalledWith(42, undefined);
  });

  test('query works', async () => {
    repo.search = mock.resolve(devs);
    await expect(select.query(mock.req.query({ id: 42, skip: 0, take: 4 }))).resolves.toStrictEqual(devs);
    expect(repo.search).toHaveBeenCalledWith({ id: 42, skip: 0, take: 4 }, { skip: 0, take: 4 });
  });

  test('search undefined returns empty list', async () => {
    repo.search = mock.resolve(devs);
    await expect(select.search('')).resolves.toHaveLength(0);
    expect(repo.search).not.toHaveBeenCalled();
  });

  test('exists works', async () => {
    repo.exists = mock.resolve(true);
    await expect(select.exists(42)).resolves.toBeTruthy();
    expect(repo.exists).toHaveBeenCalledWith(42);
  });
});
