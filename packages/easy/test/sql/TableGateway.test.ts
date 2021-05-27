import { DataProvider, Exception, TableGateway, toList } from '../../src';
import { Dev, devData, DevTable } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('TableGateway', () => {
  const table = new DevTable();
  let target: TableGateway<DevTable>;
  const provider: DataProvider = mock.empty<DataProvider>();

  beforeEach(() => {
    target = new TableGateway(table, provider);
  });

  test('default construction', () => {
    const t = new TableGateway(table);
    expect(t).toBeInstanceOf(TableGateway);
    expect(t.provider).toBeDefined();
  });

  test('all', async () => {
    provider.query = mock.resolve(toList(devData.wouter, devData.jeroen));
    const res = await target.all();
    expect(res.toJSON()).toEqual([table.in(devData.wouter), table.in(devData.jeroen)]);
    expect(provider.query).toBeQueriedWith(table.select());
  });

  test('byId', async () => {
    provider.query = mock.resolve(toList(devData.wouter));
    await expect(target.byId(42)).resolves.toEqual(table.in(devData.wouter));
    expect(provider.query).toBeQueriedWith(table.select().where(table.id.is(42)));
  });

  test('byId empty response', async () => {
    provider.query = mock.resolve(toList());
    await expect(target.byId(42)).resolves.toEqual(undefined);
    expect(provider.query).toBeQueriedWith(table.select().where(table.id.is(42)));
  });

  test('by', async () => {
    await expect(target.by('name', 'jeroen')).rejects.toMatchException(Exception.IsNotImplemented);
  });

  test('search', async () => {
    await expect(target.search('jeroen')).rejects.toMatchException(Exception.IsNotImplemented);
  });

  test('exists', async () => {
    target.byId = mock.resolve({});
    await expect(target.exists(42)).resolves.toBe(true);
    expect(target.byId).toHaveBeenCalledWith(42);
  });

  test('does not exist because byId returns undefined', async () => {
    target.byId = mock.resolve();
    await expect(target.exists(42)).resolves.toBe(false);
    expect(target.byId).toHaveBeenCalledWith(42);
  });

  test('add', async () => {
    provider.query = mock.resolve(toList(devData.jeroen));
    await expect(target.add(Dev.Jeroen.toJSON())).resolves.toEqual(table.in(devData.jeroen));
    expect(provider.query).toBeQueriedWith(table.insert(Dev.Jeroen.toJSON()));
  });

  test('add fails', async () => {
    provider.query = mock.resolve(toList());
    await expect(target.add(Dev.Jeroen.toJSON())).rejects.toEqual(`Could not add items with id ${Dev.Jeroen.id}`);
    expect(provider.query).toBeQueriedWith(table.insert(Dev.Jeroen.toJSON()));
  });

  test('remove', async () => {
    provider.command = mock.resolve(toList());
    await expect(target.remove(42)).resolves.toBeTruthy();
    expect(provider.command).toBeQueriedWith(table.delete().where(table.id.is(42)));
  });

  test('update', async () => {
    provider.query = mock.resolve(toList(devData.jeroen));
    await expect(target.update(Dev.Jeroen.toJSON())).resolves.toEqual(table.in(devData.jeroen));
    expect(provider.query).toBeQueriedWith(table.update(Dev.Jeroen.toJSON()).where(table.id.is(Dev.Jeroen.id)));
  });

  test('update fails', async () => {
    provider.query = mock.resolve(toList());
    await expect(target.update(Dev.Jeroen.toJSON())).rejects.toEqual(`Could not update item with id ${Dev.Jeroen.id}`);
    expect(provider.query).toBeQueriedWith(table.update(Dev.Jeroen.toJSON()).where(table.id.is(Dev.Jeroen.id)));
  });
});
