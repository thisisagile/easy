import { DevDatabase, DevTable } from '../ref';
import { Table } from '../../src';

describe('Table', () => {
  const table = new DevTable();

  test('toString works', () => {
    expect(table.toString()).toBe('DevTable');
  });

  test('default setup works', () => {
    expect(table.db).toBe(DevDatabase.DevDB);
    expect(table.id.name).toBe('Id');
    expect(table.columns).toHaveLength(3);
  });
});
