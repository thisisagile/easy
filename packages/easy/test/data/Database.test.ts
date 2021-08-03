import { Database, DataProvider } from '../../src';
import { DefaultProvider } from '../../src';

describe('Database', () => {

  class TestProvider implements DataProvider{
  }

  test('provide works with ctor', () => {
    expect(new Database('test with instance', TestProvider ).provide()).toBeInstanceOf(TestProvider);
  });

  test('provide works with instance', () => {
    const provider = new DefaultProvider();
    expect(new Database('test with instance',provider ).provide()).toBe(provider);
  });

});
