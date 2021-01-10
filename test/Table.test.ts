import { DevTable } from './ref';

describe('Table', () => {

  const table = new DevTable();

  test('toString works', () => {
    expect(table.toString()).toBe("DevTable");
  });

  test('columns works', () => {
    expect(table.columns).toHaveLength(3);
  });
});
