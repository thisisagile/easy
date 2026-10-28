import Database from '../../src/entries/Database';
import * as DatabaseSource from '../../src/data/Database';
import { DataProvider } from '../../src';

describe('Database', () => {
  class TestProvider implements DataProvider {}

  test('supports default namespace and named catalogue imports', () => {
    const custom: Database.Enum = new Database.Enum('custom', TestProvider);

    expect(Database.Enum).toBe(DatabaseSource.Enum);
    expect(custom).toBeInstanceOf(Database.Enum);
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
