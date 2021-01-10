import { DevDatabase, DevTable } from '../ref';
import { Table } from '../../src';
import '@thisisagile/easy-test';

describe('Table', () => {
  const table = new DevTable();

  test('toString works', () => {
    expect(table).toMatchText('DevTable');
  });

  test('default setup works', () => {
    expect(table.db).toBe(DevDatabase.DevDB);
    expect(table.id.name).toBe('Id');
    expect(table.columns).toHaveLength(3);
  });
});
