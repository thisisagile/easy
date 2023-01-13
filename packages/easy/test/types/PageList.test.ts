import '@thisisagile/easy-test';
import { isPageList, toFilter, toList, toPageList, toShortFilter } from '../../src';
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

  test('toPageList works with PageList as input', () => {
    const pl = toPageList(Dev.All, { total: 42 });
    const pl2 = toPageList(pl, pl);
    expect(pl2).toHaveLength(Dev.All.length);
    expect(pl2.total).toBe(42);
  });

  test('toPageList list and filters', () => {
    const pl = toPageList(Dev.All, {
      total: 42,
      filters: [{ field: 'offer.items.cat', shortField: 'cat', label: 'category', values: [{ label: 'Wonen', value: '1233-123-13' }] }],
    });
    expect(pl.filters).toBeDefined();
    expect(pl.filters).toHaveLength(1);
    expect(pl.filters?.[0].field).toBe('offer.items.cat');
    expect(pl.filters?.[0].shortField).toBe('cat');
    expect(pl.filters?.[0].label).toBe('category');
    expect(pl.filters?.[0].values).toHaveLength(1);
  });

  test('isPageList', () => {
    const l = toList([]);
    const pl = toPageList([], { take: 5, skip: 1, total: 42 });

    expect(isPageList([])).toBeFalsy();
    expect(isPageList(l)).toBeFalsy();
    expect(isPageList(pl)).toBeTruthy();
  });

  test('toFilter', () => {
    expect(toFilter('start', 42)).toMatchJson({ field: 'start', shortField: 'start', values: [{ value: 42 }] });
  });

  test('toShortFilter', () => {
    expect(toShortFilter('start', 'end', 42)).toMatchJson({ field: 'start', shortField: 'end', values: [{ value: 42 }] });
  });
});
