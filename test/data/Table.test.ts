import { Dev, devData, DevDatabase, DevTable } from '../ref';
import { Delete, Select, Table } from '../../src';
import '@thisisagile/easy-test';

describe('Table', () => {
  const table = new DevTable();

  test('toString works', () => {
    expect(table).toMatchText('DevTable');
  });

  test('default setup works', () => {
    expect(table.db).toBe(DevDatabase.DevDB);
    expect(table.id.name).toBe('Id');
    expect(table.properties).toHaveLength(4);
  });

  test('select without columns', () => {
    const sel = table.select();
    expect(sel).toBeInstanceOf(Select);
    expect(sel.columns).toHaveLength(0);
  });

  test('select with columns', () => {
    const sel = table.select(table.name, table.level);
    expect(sel.columns).toHaveLength(2);
  });

  test('delete', () => {
    const del = table.delete();
    expect(del).toBeInstanceOf(Delete);
  });
});

describe('Table in and out', () => {
  const empty = new Table();
  const dev = new DevTable();

  test('properties are correct', () => {
    expect(dev.level.options.def).toBe(3);
    expect(dev.level.options.convert).toBeDefined();
    expect(dev.name.options.def).toBeUndefined();
    expect(dev.name.options.convert).toBeDefined();
    expect(dev.language.options.def).toBe('TypeScript');
    expect(dev.language.options.convert).toBeDefined();
    expect(dev.id.options.def).toBe(42);
    expect(dev.id.options.convert).toBeDefined();
  });

  test('count properties', () => {
    expect(empty.properties).toHaveLength(1);
    expect(dev.properties).toHaveLength(4);
  });

  test('empty table.from with undefined is undefined', () => {
    const j = empty.in();
    expect(j).toMatchObject({});
  });

  test('empty table.to with undefined is undefined', () => {
    const j = empty.out();
    expect(j).toMatchObject({});
  });

  test('empty table.from is correct', () => {
    const j = empty.in(devData.jeroen);
    expect(j).toMatchObject(devData.jeroen);
  });

  test('empty table.to is correct', () => {
    const j = empty.out(devData.jeroen);
    expect(j).toMatchObject(devData.jeroen);
  });

  test('table.to is correct', () => {
    const j = dev.out(Dev.Jeroen.toJSON());
    expect(j).toEqual({ Id: 1, Language: 'TypeScript', Name: 'Jeroen', CodingLevel: '3' });
  });

  test('table.from is correct', () => {
    const j = dev.in(devData.jeroen);
    expect(j).toEqual({ id: 54, name: 'Jeroen', level: 3, language: 'TypeScript' });
  });

  test('table.from without id uses default', () => {
    const j = dev.in(devData.withoutId);
    expect(j).toEqual({ id: 42, name: 'Sander', level: 3, language: 'TypeScript' });
  });
});
