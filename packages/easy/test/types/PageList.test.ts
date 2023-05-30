import '@thisisagile/easy-test';
import { asc, Id, isPageList, toFilter, toList, toPageList, toShortFilter } from '../../src';
import { Dev } from '../ref';

describe('PageList', () => {
  const allDevs = toPageList(Dev.All, { total: 42 });

  test('toPageList(number) => [number]', () => {
    const l = toPageList<Id>([2]);
    expect(l).toHaveLength(1);
    expect(l[0]).toBe(2);
  });

  test('toPageList([string]) => [string]', () => {
    const l = toPageList<Id>(['hello']);
    expect(l).toHaveLength(1);
    expect(l[0]).toBe('hello');
  });

  test('toPageList empty', () => {
    const pl = toPageList();
    expect(pl).toBeDefined();
    expect(pl).toHaveLength(0);
    expect(pl.take).toBe(250);
    expect(pl.skip).toBe(0);
    expect(pl.total).toBeUndefined();
  });

  test('toPageList with full options', () => {
    const pl = toPageList([], { take: 5, skip: 1, total: 42, sorts: { name: asc } });
    expect(pl).toBeDefined();
    expect(pl).toHaveLength(0);
    expect(pl.take).toBe(5);
    expect(pl.skip).toBe(1);
    expect(pl.total).toBe(42);
    expect(pl.sorts).toStrictEqual({ name: asc });
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

  test('asc', () => {
    expect(allDevs.map(d => d.name).total).toBe(allDevs.total);
    expect(allDevs.mapDefined(d => d.name).total).toBe(allDevs.total);
    expect(allDevs.flatMap(d => d.name).total).toBe(allDevs.total);
    expect(allDevs.filter(d => d.name === 'Wouter').total).toBe(allDevs.total);
    expect(allDevs.asc(d => d.name).total).toBe(allDevs.total);
    expect(allDevs.desc(d => d.name).total).toBe(allDevs.total);
    expect(allDevs.slice(1).total).toBe(allDevs.total);
    expect(allDevs.concat(Dev.Sander).total).toBe(allDevs.total);
    expect(allDevs.splice(2).total).toBe(allDevs.total);
    expect(allDevs.distinct().total).toBe(allDevs.total);
    expect(allDevs.distinctByKey('name').total).toBe(allDevs.total);
    expect(allDevs.diff(allDevs).total).toBe(allDevs.total);
    expect(allDevs.diffByKey(allDevs, 'name').total).toBe(allDevs.total);
    expect(allDevs.defined().total).toBe(allDevs.total);
    expect(allDevs.reverse().total).toBe(allDevs.total);
    expect(allDevs.replace('name', Dev.Sander).total).toBe(allDevs.total);
    expect(allDevs.remove(Dev.Sander).total).toBe(allDevs.total);
    expect(allDevs.intersect(allDevs).total).toBe(allDevs.total);
    expect(allDevs.intersectByKey(allDevs, 'name').total).toBe(allDevs.total);
  });
});
