import { Exception, Repository } from '../../src';
import '@thisisagile/easy-test';

describe('Repository', () => {
  let r = new Repository<string>();

  beforeEach(() => {
    r = new Repository();
  });

  test('default construction', () => {
    expect(new Repository()).toBeInstanceOf(Repository);
  });

  test.each(Object.getOwnPropertyNames(Repository.prototype).filter(m => m != 'constructor'))('execute %s', async m => {
    await expect((r as any)[m]()).rejects.toMatchException(Exception.IsNotImplemented);
  });
});
