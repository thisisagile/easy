import '@thisisagile/easy-test';
import { toPageList } from '../../src';
import { Dev } from '../ref';

describe('PageList', () => {

  test('toPageList empty', () => {
    const pl = toPageList();
    expect(pl).toBeDefined();
    expect(pl).toHaveLength(0);
    expect(pl.take).toBe(250);
    expect(pl.skip).toBe(0);
    expect(pl.total).toBeUndefined();
  });

  test('toPageList with full options', () => {
    const pl = toPageList([], { take: 5, skip: 1, total: 42 });
    expect(pl).toBeDefined();
    expect(pl).toHaveLength(0);
    expect(pl.take).toBe(5);
    expect(pl.skip).toBe(1);
    expect(pl.total).toBe(42);
  });

  test('toPageList empty list', () => {
    const pl = toPageList([]);
    expect(pl).toHaveLength(0);
    expect(pl.total).toBeUndefined();
  });

  test('toPageList undefined and total', () => {
    const pl = toPageList(undefined, { total: 42 });
    expect(pl).toHaveLength(0);
    expect(pl.total).toBe(42);
  });

  test('toPageList empty list and total', () => {
    const pl = toPageList([], { total: 42 });
    expect(pl).toHaveLength(0);
    expect(pl.total).toBe(42);
  });

  test('toPageList list', () => {
    const pl = toPageList(Dev.All);
    expect(pl).toHaveLength(Dev.All.length);
    expect(pl.total).toBeUndefined();
  });

  test('toPageList list and total', () => {
    const pl = toPageList(Dev.All, { total: 42 });
    expect(pl).toHaveLength(Dev.All.length);
    expect(pl.total).toBe(42);
  });
});


