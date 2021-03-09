import { Manage } from '../../src';
import { Dev, DevRepo } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Manage', () => {
  const repo = new DevRepo();
  let manage: Manage<Dev>;

  beforeEach(() => {
    manage = new Manage<Dev>(repo);
  });

  test('add works', async () => {
    repo.add = mock.resolve(Dev.Sander);
    await expect(manage.add({})).resolves.toMatchObject(Dev.Sander);
    expect(repo.add).toHaveBeenCalled();
  });


  test('update works', async () => {
    repo.update = mock.resolve(Dev.Sander);
    await expect(manage.update({})).resolves.toMatchObject(Dev.Sander);
    expect(repo.update).toHaveBeenCalled();
  });

  test('upsert works', async () => {
    repo.upsert = mock.resolve(Dev.Sander);
    await expect(manage.upsert(Dev.Sander.toJSON())).resolves.toMatchObject(Dev.Sander);
    expect(repo.upsert).toHaveBeenCalledWith(Dev.Sander.toJSON());
  });

  test('remove works', async () => {
    repo.remove = mock.resolve(true);
    await expect(manage.remove(42)).resolves.toBeTruthy();
    expect(repo.remove).toHaveBeenCalled();
  });
});
