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
    expect(pl.options).toEqual({ take: 5, skip: 1, total: 42, sorts: { name: asc } });
    expect(pl).toHaveLength(0);
    expect(pl.take).toBe(5);
    expect(pl.skip).toBe(1);
    expect(pl.total).toBe(42);
    expect(pl.sorts).toStrictEqual({ name: asc });
  });

  test('meta', () => {
    const pl = toPageList([], {
      take: 5,
      skip: 1,
      total: 42,
      sorts: { name: asc },
      filters: [{ field: 'name', values: [{ value: 3 }] }],
    });
    expect(pl).toBeDefined();
    expect(pl.meta).toEqual({
      take: 5,
      skip: 1,
      total: 42,
      sorts: { name: asc },
      filters: [{ field: 'name', values: [{ value: 3 }] }],
    });
  });

  test('meta sorts as string[]', () => {
    const pl = toPageList([], { take: 5, skip: 1, total: 42, sorts: ['name-asc', 'price-desc'] });
    expect(pl).toBeDefined();
    expect(pl.meta).toEqual({ take: 5, skip: 1, total: 42, sorts: ['name-asc', 'price-desc'] });
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
      filters: [
        {
          field: 'offer.items.cat',
          shortField: 'cat',
          label: 'category',
          values: [{ label: 'Wonen', value: '1233-123-13' }],
        },
      ],
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
    expect(toShortFilter('start', 'end', 42)).toMatchJson({
      field: 'start',
      shortField: 'end',
      values: [{ value: 42 }],
    });
  });

  test('overloads', () => {
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
    expect(allDevs.distinctByValue().total).toBe(allDevs.total);
    expect(allDevs.diff(allDevs).total).toBe(allDevs.total);
    expect(allDevs.diffByKey(allDevs, 'name').total).toBe(allDevs.total);
    expect(allDevs.defined().total).toBe(allDevs.total);
    expect(allDevs.reverse().total).toBe(allDevs.total);
    expect(allDevs.replace('name', Dev.Sander).total).toBe(allDevs.total);
    expect(allDevs.remove(Dev.Sander).total).toBe(allDevs.total);
    expect(allDevs.intersect(allDevs).total).toBe(allDevs.total);
    expect(allDevs.intersectByKey(allDevs, 'name').total).toBe(allDevs.total);
  });

  describe('accumulate', () => {
    test('accumulate', () => {
      const data = [
        { hour: '09:00', app: 4, website: 5 },
        { hour: '10:00', app: 6, website: 7 },
        { hour: '11:00', app: 8, website: 9 },
      ];

      const accumulatedData = [
        { hour: '09:00', app: 4, website: 5 },
        { hour: '10:00', app: 10, website: 12 },
        { hour: '11:00', app: 18, website: 21 },
      ];

      const acc = toPageList(data, { total: 5 }).accumulate('app', 'website');
      acc.map((d, i) => expect(d).toMatchObject(accumulatedData[i]));
      expect(acc.total).toBe(5);
    });
  });

  describe('update', () => {
    test('update', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal]);
      const upd = ds.update(d => d.id === Dev.Jeroen.id, Dev.Rob);
      expect(upd).toHaveLength(2);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
    });

    test('update updates many', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal, Dev.Jeroen]);
      const upd = ds.update(d => d.id === Dev.Jeroen.id, Dev.Rob);
      expect(upd).toHaveLength(3);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
      expect(upd[2].name).toBe('Rob');
    });

    test('update with index', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal, Dev.Jeroen]);
      const upd = ds.update((d, i) => d.id === Dev.Jeroen.id && i < 1, Dev.Rob);
      expect(upd).toHaveLength(3);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
      expect(upd[2].name).toBe('Jeroen');
    });

    test('update first', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal, Dev.Jeroen]);
      const upd = ds.updateFirst(d => d.id === Dev.Jeroen.id, Dev.Rob);
      expect(upd).toHaveLength(3);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
      expect(upd[2].name).toBe('Jeroen');
    });

    test('update by id', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal]);
      const upd = ds.updateById(Dev.Jeroen.id, Dev.Rob);
      expect(upd).toHaveLength(2);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
    });

    test('update updates by id', () => {
      const ds = toPageList([Dev.Jeroen, Dev.Naoufal, Dev.Jeroen]);
      const upd = ds.updateById(Dev.Jeroen.id, Dev.Rob);
      expect(upd).toHaveLength(3);
      expect(upd[0].name).toBe('Rob');
      expect(upd[1].name).toBe('Naoufal');
      expect(upd[2].name).toBe('Rob');
    });

    test('update first by id', () => {
      const devs = toPageList([Dev.Jeroen, Dev.Naoufal, Dev.Jeroen]);
      const updated = devs.updateFirstById(Dev.Jeroen.id, Dev.Rob);
      expect(updated).toHaveLength(3);
      expect(updated[0].name).toBe('Rob');
      expect(updated[1].name).toBe('Naoufal');
      expect(updated[2].name).toBe('Jeroen');
    });
  });
});
