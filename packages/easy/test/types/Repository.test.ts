import { Repository } from '../../src';
import { Exception } from '@thisisagile/easy';
import '@thisisagile/easy-test';

describe('Repository', () => {
  let r = new Repository<string>();

  beforeEach(() => {
    r = new Repository();
  });

  test('default construction', () => {
    expect(new Repository()).toBeInstanceOf(Repository);
  });

  test.each(Object.getOwnPropertyNames(Repository.prototype).filter(m => m != 'constructor'))('execute %s', m => {
    expect((r as any)[m]()).rejects.toMatchException(Exception.IsNotImplemented);
  });
});
