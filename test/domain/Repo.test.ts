import { DevGateway, DevRepo } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Repo', () => {

  let gateway: DevGateway;
  let repo: DevRepo;

  beforeEach(() => {
    gateway = new DevGateway();
    repo = new DevRepo(gateway);
  });

  test('all triggers gateway', async () => {
    gateway.all = mock.resolve([]);
    await repo.all();
    expect(gateway.all).toHaveBeenCalled();
  });
});
