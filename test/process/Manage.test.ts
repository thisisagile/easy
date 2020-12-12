import { Manage } from '../../src';
import { Dev, DevRepo } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Manage', () => {

  const repo = new DevRepo();
  let manage: Manage<Dev>;

  beforeEach(() => {
    manage = new Manage<Dev>(repo);
  });

  test('add works', () => {
    repo.add = mock.resolve(Dev.Sander);
    expect(manage.add({})).resolves.toMatchObject(Dev.Sander);
    expect(repo.add).toHaveBeenCalled();
  });

  test('update works', () => {
    repo.update = mock.resolve(Dev.Sander);
    expect(manage.update({})).resolves.toMatchObject(Dev.Sander);
    expect(repo.update).toHaveBeenCalled();
  });

  test('remove works', () => {
    repo.remove = mock.resolve(true);
    expect(manage.remove(42)).resolves.toBeTruthy();
    expect(repo.remove).toHaveBeenCalled();
  });

});
