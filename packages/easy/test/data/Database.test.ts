import * as Database from '../../src/data/Database';
import { DataProvider } from '../../src';

describe('Database', () => {
  class TestProvider implements DataProvider {}

  test('constructs custom databases through the catalogue namespace', () => {
    const custom: Database.Enum = new Database.Enum('custom', TestProvider);

    expect(custom).toBeInstanceOf(Database.Enum);
    expect(custom.id).toBe('custom');
  });

  test('provide works with ctor', () => {
    expect(Database.create('test with instance', TestProvider).provide()).toBeInstanceOf(TestProvider);
  });

  test('provide works with instance', () => {
    const provider = new Database.DefaultProvider();
    expect(Database.create('test with instance', provider).provide()).toBe(provider);
  });

  test('exposes the default database through the explicit registry', () => {
    expect(Database.byId('default')).toBe(Database.Default);
    expect(Database.all()).toEqual([Database.Default]);
  });
});
