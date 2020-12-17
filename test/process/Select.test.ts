import { list, Select } from '../../src';
import { Dev, DevRepo } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Select', () => {
  const devs = list(Dev.Sander, Dev.Jeroen, Dev.Naoufal);
  const repo = new DevRepo();
  let select: Select<Dev>;

  beforeEach(() => {
    select = new Select<Dev>(repo);
  });

  test('all works', () => {
    repo.all = mock.resolve(devs);
    expect(select.all()).toBeDefined();
    expect(repo.all).toHaveBeenCalled();
  });

  test('byId works', () => {
    repo.byId = mock.resolve(devs.first());
    expect(select.byId(42)).toBeDefined();
    expect(repo.byId).toHaveBeenCalledWith(42);
  });

  test('search works', () => {
    repo.search = mock.resolve(devs);
    expect(select.search(42)).toBeDefined();
    expect(repo.search).toHaveBeenCalledWith(42);
  });

  test('exists works', () => {
    repo.exists = mock.resolve(true);
    expect(select.exists(42)).toBeDefined();
    expect(repo.exists).toHaveBeenCalledWith(42);
  });
});
