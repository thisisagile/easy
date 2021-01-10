import { DevDatabase, DevTable } from './ref';

describe('Table', () => {

  const table = new DevTable();

  test('toString works', () => {
    expect(table.toString()).toBe("DevTable");
  });

  test('db and columns works', () => {
    expect(table.db).toBe(DevDatabase.DevDB);
    expect(table.columns).toHaveLength(3);
  });
});
