import { Certificate, Dev } from '../ref';
import { asList, DateTime, Enum, HasId, Id, isEmpty, isList, List, maxValue, minValue, reject, resolve, toList } from '../../src';
import '@thisisagile/easy-test';

describe('List', () => {
  const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
  const managers = toList([Dev.Jeroen, Dev.Naoufal, Dev.Rob]);
  const johnAndJane = toList(
    { id: 1, name: 'John', age: undefined, weight: 99 },
    {
      id: 2,
      name: 'Jane',
      age: undefined,
      weight: 95,
    }
  );
  const jackAndJill = toList(
    { id: 1, name: 'Jack', age: undefined, weight: undefined as unknown as number },
    {
      id: 2,
      name: 'Jill',
      age: undefined,
      weight: undefined as unknown as number,
    }
  );

  test('list and array are equal', () => {
    expect(new List('test', 'test2')).toEqual(['test', 'test2']);
  });

  test('asc and desc', () => {
    expect(devs.asc('name').last()).toMatchObject(Dev.Wouter);
    expect(devs.asc('name').first()).toMatchObject(Dev.Jeroen);
    expect(devs.desc(d => d.name).first()).toMatchObject(Dev.Wouter);
    expect(devs.desc(d => d.name).last()).toMatchObject(Dev.Jeroen);
  });

  test('desc by date', () => {
    const first = { created: new DateTime('2020-01-01T00:00:00') },
      second = { created: new DateTime('2020-01-02T00:00:00') },
      third = { created: new DateTime('2020-01-03T00:00:00') },
      l = toList([first, third, second]);
    expect(l.asc('created').first()).toMatchObject(first);
    expect(l.desc('created').first()).toMatchObject(third);
  });

  test('map', () => {
    expect(devs.map(d => d.language)).toBeInstanceOf(List);
    expect(
      devs
        .asc('name')
        .map(d => d.name)
        .first()
    ).toBe(Dev.Jeroen.name);
  });

  test('flatMap', () => {
    const certificates = devs.flatMap(d => d.certificates);
    expect(certificates).toBeInstanceOf(List);
    expect(certificates).toHaveLength(6);
    expect(certificates.toJSON()).toMatchJson([Certificate.ScrumMaster, Certificate.ScrumMaster, Certificate.Flow, Certificate.ScrumMaster, Certificate.MSP]);
  });

  test('mapDefined', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]).mapDefined(d => d.name);
    expect(devs).toBeInstanceOf(List);
    expect(devs).toHaveLength(3);
  });

  test('mapAsync success', async () => {
    const hello = (d: Dev): Promise<Dev> => resolve(d);
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]);

    await expect(devs.mapAsync(d => hello(d))).resolves.toMatchText(devs);
  });

  test('mapAsync rejects', async () => {
    const hello = (_d: Dev): Promise<Dev> => reject('error');
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]);

    await expect(devs.mapAsync(d => hello(d))).rejects.toBe('error');
  });

  test('mapSerial success', async () => {
    const hello = (d: Dev): Promise<Dev> => resolve(d);
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]);

    await expect(devs.mapSerial(d => hello(d))).resolves.toMatchText(devs);
  });

  test('filter', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]).filter(d => d.name.includes('a'));
    expect(devs).toBeInstanceOf(List);
    expect(devs).toHaveLength(2);
  });

  test('first', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(devs.first()).toMatchObject(Dev.Sander);
    expect(devs.first(d => d.name === Dev.Jeroen.name)).toMatchObject(Dev.Jeroen);
    expect(devs.first(d => d.name === 'Rene')).toBeUndefined();
    expect(new List().first()).toBeUndefined();
  });

  test('last', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(devs.last()).toMatchObject(Dev.Naoufal);
    expect(devs.last(d => d.name === Dev.Jeroen.name)).toMatchObject(Dev.Jeroen);
    expect(devs.last(d => d.name === 'Rene')).toBeUndefined();
    expect(new List().last()).toBeUndefined();
  });

  test('isFirst', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(new List().isFirst(Dev.Jeroen)).toBeFalsy();
    expect(devs.isFirst(Dev.Wouter)).toBeFalsy();
    expect(devs.isFirst(Dev.Sander)).toBeTruthy();
  });

  test('isLast', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(new List().isLast(Dev.Jeroen)).toBeFalsy();
    expect(devs.isLast(Dev.Wouter)).toBeFalsy();
    expect(devs.isLast(Dev.Naoufal)).toBeTruthy();
  });

  test('overlaps', () => {
    const a = toList(Dev.Jeroen, Dev.Wouter, Dev.Naoufal);
    expect(a.overlaps()).toBeFalsy();
    expect(a.overlaps(Dev.Rob)).toBeFalsy();
    expect(a.overlaps([Dev.Rob, Dev.Sander])).toBeFalsy();
    expect(a.overlaps(toList(Dev.Rob, Dev.Sander))).toBeFalsy();
    expect(a.overlaps(Dev.Wouter)).toBeTruthy();
    expect(a.overlaps(Dev.Wouter, Dev.Sander)).toBeTruthy();
    expect(a.overlaps(toList(Dev.Rob, Dev.Sander, Dev.Jeroen))).toBeTruthy();
  });

  test('is subset of', () => {
    const devs = toList(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander);
    expect(devs.isSubSetOf()).toBeFalsy();
    expect(devs.isSubSetOf(Dev.Jeroen)).toBeFalsy();
    expect(devs.isSubSetOf(Dev.Jeroen, Dev.Naoufal)).toBeFalsy();
    expect(devs.isSubSetOf(Dev.Eugen)).toBeFalsy();
    expect(devs.isSubSetOf(Dev.Jeroen, Dev.Eugen)).toBeFalsy();

    expect(devs.isSubSetOf(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander)).toBeTruthy();
    expect(devs.isSubSetOf(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander, Dev.Eugen)).toBeTruthy();
  });

  test('is superset of', () => {
    const devs = toList(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander);
    expect(devs.isSuperSetOf()).toBeTruthy();
    expect(devs.isSuperSetOf(Dev.Jeroen)).toBeTruthy();
    expect(devs.isSuperSetOf(Dev.Jeroen, Dev.Naoufal)).toBeTruthy();
    expect(devs.isSuperSetOf(Dev.Eugen)).toBeFalsy();
    expect(devs.isSuperSetOf(Dev.Jeroen, Dev.Eugen)).toBeFalsy();

    expect(devs.isSuperSetOf(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander)).toBeFalsy();
    expect(devs.isSuperSetOf(Dev.Jeroen, Dev.Wouter, Dev.Naoufal, Dev.Sander, Dev.Eugen)).toBeFalsy();
  });

  test('is intersecting with', () => {
    expect(toList().isIntersectingWith(toList())).toBeFalsy();
    expect(toList(Dev.Jeroen).isIntersectingWith(Dev.Eugen)).toBeFalsy();
    expect(toList(Dev.Jeroen).isIntersectingWith(Dev.Jeroen)).toBeTruthy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isIntersectingWith(Dev.Jeroen)).toBeTruthy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isIntersectingWith(Dev.Jeroen, Dev.Eugen)).toBeTruthy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isIntersectingWith(Dev.Jeroen, Dev.Eugen, Dev.Rob)).toBeTruthy();
    expect(toList(Dev.Rob).isIntersectingWith(Dev.Jeroen, Dev.Eugen, Dev.Rob)).toBeTruthy();
  });

  test('is disjoint with', () => {
    expect(toList().isDisjointWith(toList())).toBeTruthy();
    expect(toList().isDisjointWith(toList(Dev.Eugen))).toBeTruthy();
    expect(toList(Dev.Jeroen).isDisjointWith(Dev.Eugen)).toBeTruthy();
    expect(toList(Dev.Jeroen, Dev.Rob).isDisjointWith(Dev.Eugen, Dev.Naoufal)).toBeTruthy();

    expect(toList(Dev.Jeroen).isDisjointWith(Dev.Jeroen)).toBeFalsy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isDisjointWith(Dev.Jeroen)).toBeFalsy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isDisjointWith(Dev.Jeroen, Dev.Eugen)).toBeFalsy();
    expect(toList(Dev.Jeroen, Dev.Eugen).isDisjointWith(Dev.Jeroen, Dev.Eugen, Dev.Rob)).toBeFalsy();
    expect(toList(Dev.Rob).isDisjointWith(Dev.Jeroen, Dev.Eugen, Dev.Rob)).toBeFalsy();
  });

  test('concat', () => {
    const devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.concat()).toBeInstanceOf(List);
    expect(devs.concat()).toHaveLength(2);
    expect(devs.concat([])).toHaveLength(2);
    expect(devs.concat([Dev.Naoufal])).toHaveLength(3);
    expect(devs.concat(Dev.Naoufal)).toHaveLength(3);
    expect(devs.concat(Dev.Naoufal, Dev.Jeroen)).toHaveLength(4);
    expect(devs.concat(toList(Dev.Naoufal, Dev.Jeroen))).toHaveLength(4);
  });

  test('add', () => {
    let devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add()).toBeInstanceOf(List);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add()).toHaveLength(2);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add([])).toHaveLength(2);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add(Dev.Naoufal)).toHaveLength(3);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add([Dev.Naoufal])).toHaveLength(3);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add(toList(Dev.Naoufal))).toHaveLength(3);
    devs = toList(Dev.Sander, Dev.Wouter);
    expect(devs.add(toList(Dev.Naoufal, Dev.Jeroen))).toHaveLength(4);
  });

  test('replace undefined', () => {
    const devs = toList(Dev.Sander, Dev.RobC, Dev.Wouter);
    expect(devs.replace('id', undefined as unknown as Dev)).toHaveLength(3);
    expect(devs[0]).toMatchObject(Dev.Sander);
  });

  test('replace empty object', () => {
    const devs = toList(Dev.Sander, Dev.RobC, Dev.Wouter);
    expect(devs.replace('id', {} as unknown as Dev)).toHaveLength(3);
    expect(devs[0]).toBe(Dev.Sander);
  });

  test('replace works when id matches', () => {
    const devs = toList(Dev.Sander, Dev.RobC, Dev.Wouter);
    expect(devs.replace('id', { id: Dev.Sander.id } as unknown as Dev)).toHaveLength(3);
    expect(devs[0]).not.toBeInstanceOf(Dev);
    expect(devs[0].name).toBeUndefined();
  });

  test('replace', () => {
    const devs = toList(Dev.Sander, Dev.RobC, Dev.Wouter);
    expect(
      devs.replace(
        'id',
        new Dev({
          id: Dev.Sander.id,
          name: 'Boet',
          language: 'Typescript',
          level: 0,
        })
      )
    ).toHaveLength(3);
    expect(devs[0]).not.toMatchObject(Dev.Sander);
    expect(devs[0].name).toBe('Boet');
  });

  test('toJSON', () => {
    const json = toList(Dev.Sander, Dev.Wouter).toJSON();
    expect(json).not.toBeInstanceOf(List);
    expect(json).toBeInstanceOf(Array);
    expect(JSON.stringify(json)).toBe(JSON.stringify([Dev.Sander.toJSON(), Dev.Wouter.toJSON()]));
    const j = toList(Dev.Sander, Dev.Wouter).toJSON();
    expect(JSON.stringify(j)).toBe(JSON.stringify([Dev.Sander.toJSON(), Dev.Wouter.toJSON()]));
  });

  test('orElse', () => {
    expect(isEmpty(toList())).toBeTruthy();
    expect(toList().orElse()).toBeUndefined();
    expect(toList(Dev.Rob).orElse()).toHaveLength(1);
    expect(toList(Dev.Rob, Dev.Wouter).orElse(Dev.Jeroen)).toHaveLength(2);
    expect(toList().orElse(Dev.Rob, Dev.Jeroen)).toHaveLength(2);
    expect(toList().orElse([Dev.Rob, Dev.Jeroen])).toHaveLength(2);
    expect(toList().orElse(toList(Dev.Rob, Dev.Jeroen))).toHaveLength(2);
  });

  test('diff', () => {
    expect(toList(1, 2, 3, 4).diff([4, 5, 6])).toMatchJson(toList([1, 2, 3]));
    expect(toList(1, 2, 3, 4).diff([])).toMatchJson(toList([1, 2, 3, 4]));
    expect(toList(1, 2, 3, 4).diff([1, 2, 3, 4])).toMatchJson(toList());
    expect(toList().diff(toList())).toMatchJson(toList());
    expect(toList({ id: 42 }).diff(toList())).toMatchJson(toList({ id: 42 }));
    expect(toList().diff(toList({ id: 42 }))).toMatchJson(toList());
    const proletarians = devs.diff(managers);
    expect(proletarians).toHaveLength(2);
    expect(proletarians).toContain(Dev.Sander);
    expect(proletarians).toContain(Dev.Wouter);
  });

  test('diff by key', () => {
    expect(devs.diffByKey(managers, 'name')).toHaveLength(2);
    expect(johnAndJane.diffByKey(jackAndJill, 'id')).toHaveLength(0);
    expect(johnAndJane.diffByKey(jackAndJill, 'name')).toHaveLength(2);
    expect(johnAndJane.diffByKey(jackAndJill, 'age')).toHaveLength(0);
    expect(johnAndJane.diffByKey(jackAndJill, 'weight')).toHaveLength(2);
  });

  test('symmetric diff', () => {
    expect(toList(1, 2, 3, 4).symmetricDiff([4, 5, 6])).toEqual(toList([1, 2, 3, 5, 6]));
    expect(toList().symmetricDiff(toList())).toEqual(toList());
    expect(toList({ id: 42 }).symmetricDiff(toList())).toEqual(toList({ id: 42 }));
    expect(toList().symmetricDiff(toList({ id: 42 }))).toEqual(toList({ id: 42 }));
    const proletarians = devs.symmetricDiff(managers);
    expect(proletarians).toHaveLength(3);
    expect(proletarians).toContain(Dev.Sander);
    expect(proletarians).toContain(Dev.Wouter);
    expect(proletarians).toContain(Dev.Rob);
  });

  test('symmetric diff by key', () => {
    expect(devs.symmetricDiffByKey(managers, 'name')).toHaveLength(3);
    expect(johnAndJane.symmetricDiffByKey(jackAndJill, 'id')).toHaveLength(0);
    expect(johnAndJane.symmetricDiffByKey(jackAndJill, 'name')).toHaveLength(4);
    expect(johnAndJane.symmetricDiffByKey(jackAndJill, 'age')).toHaveLength(0);
    expect(johnAndJane.symmetricDiffByKey(jackAndJill, 'weight')).toHaveLength(4);
  });

  test('interSect', () => {
    expect(toList().intersect(toList())).toMatchJson(toList());
    expect(toList({ id: 42 }).intersect(toList())).toMatchJson(toList());
    expect(toList().intersect(toList({ id: 42 }))).toMatchJson(toList());
    const devManagers = devs.intersect(managers);
    expect(devManagers).toHaveLength(2);
    expect(devManagers).toContain(Dev.Naoufal);
    expect(devManagers).toContain(Dev.Jeroen);
  });

  test('interSect by key', () => {
    const devManagers = devs.intersectByKey(managers, 'name');
    expect(devManagers).toHaveLength(2);
    expect(devManagers).toContain(Dev.Naoufal);
    expect(devManagers).toContain(Dev.Jeroen);

    expect(johnAndJane.intersectByKey(jackAndJill, 'id')).toHaveLength(2);
    expect(johnAndJane.intersectByKey(jackAndJill, 'name')).toHaveLength(0);
    expect(johnAndJane.intersectByKey(jackAndJill, 'age')).toHaveLength(2);
    expect(johnAndJane.intersectByKey(jackAndJill, 'weight')).toHaveLength(0);
  });

  test('intersect by key can also work on other types', () => {
    const managers = toList<{ id: Id; firstName: string }>(
      { id: 1, firstName: 'Jeroen' },
      {
        id: 1000,
        firstName: 'Naoufal',
      }
    );
    expect(devs.intersectByKey(managers, 'id')).toHaveLength(1);
  });

  test('intersect by', () => {
    const managers = toList<{ firstName: string }>({ firstName: 'Jeroen' }, { firstName: 'Naoufal' });
    expect(devs.intersectBy(managers, (d, m) => d.name === m.firstName)).toHaveLength(2);
  });

  test('byKey', () => {
    const l = toList<{ name: string; grade: number }>({ name: 'Jeroen', grade: 10 }, { name: 'Naoufal', grade: 9 });
    expect(l.byKey('grade', 9).name).toBe('Naoufal');
    expect(devs.byKey('name', 'Jeroen')).toBe(Dev.Jeroen);
    expect(devs.byKey(undefined as unknown as keyof Dev, 10)).toBeUndefined();
    expect(devs.byKey('name', undefined as unknown as string)).toBeUndefined();
  });

  test('none should return true on an empty list', () => {
    const input = new List();
    expect(input.none(i => i === true)).toBeTruthy();
  });

  test('none should return true when if a single element in the list does not match the predicate', () => {
    const input = new List(1);
    expect(input.none(i => i === 2)).toBeTruthy();
  });

  test('none should return true when all elements in the list do not match the predicate', () => {
    const input = new List(1, 2, 3);
    expect(input.none(i => i === 4)).toBeTruthy();
  });

  test('none should return false when a single element in the list matches the predicate', () => {
    const input = new List(1, 2, 3, 4);
    expect(input.none(i => i === 3)).toBeFalsy();
  });
});

describe('List.weave', () => {
  let list: List<number>;

  beforeEach(() => {
    list = toList(1, 2, 3);
  });

  test('weave does not crash if interval is a fraction or < 1', () => {
    expect(list.weave([10], -42)).toBeDefined();
    expect(list.weave([10], -1)).toBeDefined();
    expect(list.weave([10], 0)).toBeDefined();
    expect(list.weave([10], 0.5)).toBeDefined();
    expect(list.weave([10], 1.5)).toBeDefined();
    expect(list.weave([10], Math.PI)).toBeDefined();
  });

  test('weave does not insert items beyond array length', () => {
    expect(list.weave([5], list.length + 1)).toMatchJson(toList([1, 2, 3]));
  });

  test('weave inserts items after "interval" elements', () => {
    expect(list.weave([10], 2)).toMatchJson(toList(1, 2, 10, 3));
  });

  test('weave inserts items from a list sequentially', () => {
    expect(list.weave([11, 12, 13], 1)).toMatchJson(toList(1, 11, 2, 12, 3, 13));
  });

  test('weave Stops inserting when out of items', () => {
    expect(toList([1, 2, 3, 4, 5, 6]).weave([21, 42], 1)).toMatchJson(toList(1, 21, 2, 42, 3, 4, 5, 6));
  });

  test('distinctByKey', () => {
    expect(toList<Dev>().distinctByKey('id')).toHaveLength(0);
    expect(toList(Dev.Rob).distinctByKey('id')).toHaveLength(1);
    expect(toList(Dev.Rob, Dev.Rob).distinctByKey('id')).toHaveLength(1);
    expect(toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen, Dev.Naoufal, Dev.Rob, Dev.Wouter).distinctByKey('id')).toHaveLength(4);
  });

  test('distinctByKey does not change the sorting', () => {
    expect(toList(Dev.Wouter, Dev.Jeroen, Dev.Naoufal, Dev.Jeroen, Dev.Naoufal, Dev.Wouter, Dev.Rob).distinctByKey('id')).toEqual(
      toList(Dev.Wouter, Dev.Jeroen, Dev.Naoufal, Dev.Rob)
    );
  });

  test('distinct by value', () => {
    expect(toList(Dev.Jeroen, Dev.Rob, Dev.Rob).distinctByValue()).toHaveLength(2);
    expect(toList(Dev.Jeroen, Dev.Rob, Dev.Rob, Dev.Jeroen).distinctByValue()).toHaveLength(2);
    expect(toList(1, 2, 3, 3, 2).distinctByValue()).toStrictEqual([1, 2, 3]);
    expect(toList('a', 'b', 'a').distinctByValue()).toStrictEqual(['a', 'b']);
    expect(
      toList([
        {
          id: 'd0b199e9-4434-50ac-847e-61edbb95424e',
          name: 'Apple macbook air 13 inch 256gb i3 Silver',
          ean: '0190199255708',
          quantity: 1,
          qty: 1,
        },
        {
          id: 'd0b199e9-4434-50ac-847e-61edbb95424e',
          name: 'Apple macbook air 13 inch 256gb i3 Silver',
          ean: '0190199255708',
          quantity: 1,
          qty: 1,
        },
      ]).distinctByValue()
    ).toHaveLength(1);
  });
});

describe('isList', () => {
  test('Is false', () => {
    expect(isList()).toBeFalsy();
    expect(isList({})).toBeFalsy();
    expect(isList([])).toBeFalsy();
    expect(isList<Dev>([Dev.Sander, Dev.Jeroen])).toBeFalsy();
  });

  test('Is true', () => {
    expect(isList<Dev>(toList(Dev.Sander, Dev.Jeroen))).toBeTruthy();
  });

  test('toObject from undefined works', () => {
    const res = toList<Dev>().toObject('id');
    expect(res).toStrictEqual({});
  });

  test('toObject from single object works', () => {
    const res = toList(Dev.Naoufal).toObject('id');
    expect(res[Dev.Naoufal.id]).toStrictEqual(Dev.Naoufal);
  });

  test('toObject', () => {
    const res = Dev.All.toObject('id');
    expect(res).toStrictEqual({
      [Dev.Naoufal.id]: Dev.Naoufal,
      [Dev.Wouter.id]: Dev.Wouter,
      [Dev.Sander.id]: Dev.Sander,
      [Dev.Jeroen.id]: Dev.Jeroen,
      [Dev.Rob.id]: Dev.Rob,
      [Dev.RobC.id]: Dev.RobC,
    });
  });

  test('toObject and not loose the key', () => {
    const naoufal = Dev.Naoufal.toJSON() as HasId;
    const jeroen = Dev.Jeroen.toJSON() as HasId;

    const resFalse = toList(naoufal, jeroen).toObject('id', { deleteKey: false });
    expect(resFalse[naoufal.id].id).toBe(naoufal.id);
  });

  test('toObject and loose the key', () => {
    const naoufal = Dev.Naoufal.toJSON() as HasId;
    const jeroen = Dev.Jeroen.toJSON() as HasId;

    const resTrue = toList(naoufal, jeroen).toObject('id', { deleteKey: true });
    expect(resTrue[naoufal.id]?.id).toBeUndefined();
  });
});

describe('toList', () => {
  test('from nothing', () => {
    const l = toList();
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(0);
  });

  test('from undefined', () => {
    const l = toList(undefined);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(0);
  });

  test('from null', () => {
    const l = toList(null);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(0);
  });

  test('from empty array', () => {
    const l = toList([]);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(0);
  });

  test('from array', () => {
    const l = toList([Dev.Sander, Dev.Wouter]);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
  });

  test('from arrays', () => {
    const l = toList([Dev.Sander], [Dev.Wouter, Dev.Jeroen]);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
  });

  test('from single item', () => {
    const l = toList(Dev.Naoufal);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(1);
  });

  test('from two items', () => {
    const l = toList(Dev.Sander, Dev.Jeroen);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
    expect(l).toBeInstanceOf(List);
  });

  test('from array of two items', () => {
    const l = toList([Dev.Sander, Dev.Jeroen]);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
  });

  test('from spread of two items', () => {
    const spread = [Dev.Sander, Dev.Jeroen];
    const l = toList(...spread);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
  });

  test('from list of two items', () => {
    const devs = toList(toList(Dev.Naoufal, Dev.Jeroen));
    expect(isList(devs)).toBeTruthy();
    expect(devs).toHaveLength(2);
  });

  test('distinct works', () => {
    const devs = toList(Dev.Jeroen, Dev.Sander, Dev.Naoufal, Dev.Jeroen, Dev.Naoufal);
    const dist = devs.distinct();
    expect(dist).toHaveLength(3);
  });

  test('next on actual list works', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Wouter, Dev.Sander);
    expect(devs.next()).toMatchText(Dev.Jeroen);
    expect(devs.next(d => d.is(Dev.Jeroen))).toMatchText(Dev.Naoufal);
    expect(devs.next(d => d.is(Dev.Wouter))).toMatchText(Dev.Sander);
    expect(devs.next(d => d.is(Dev.Sander))).toBeUndefined();
  });

  const withSpread = (...d: Dev[]): List<Dev> =>
    toList<Dev>(d)
      .add([Dev.Sander, Dev.Sander])
      .reduce((ds, d) => ds.add(d), toList<Dev>());

  test('next on actual any list works', () => {
    const devs = withSpread(Dev.Jeroen, Dev.Wouter, Dev.Naoufal);
    expect(devs).toHaveLength(5);
  });

  test('prev on actual list from spread works', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Wouter, Dev.Sander);
    expect(devs.prev()).toMatchText(Dev.Jeroen);
    expect(devs.prev(d => d.is(Dev.Jeroen))).toBeUndefined();
    expect(devs.prev(d => d.is(Dev.Naoufal))).toMatchText(Dev.Jeroen);
    expect(devs.prev(d => d.is(Dev.Wouter))).toMatchText(Dev.Naoufal);
    expect(devs.prev(d => d.is(Dev.Sander))).toMatchText(Dev.Wouter);
  });

  test('prev on actual list with list in first element works', () => {
    const devs = toList([Dev.Naoufal, Dev.Jeroen, Dev.Wouter, Dev.Sander]);
    expect(devs.prev()).toMatchText(Dev.Naoufal);
    expect(devs.prev(d => d.is(Dev.Naoufal))).toBeUndefined();
    expect(devs.prev(d => d.is(Dev.Jeroen))).toMatchText(Dev.Naoufal);
    expect(devs.prev(d => d.is(Dev.Wouter))).toMatchText(Dev.Jeroen);
    expect(devs.prev(d => d.is(Dev.Sander))).toMatchText(Dev.Wouter);
  });

  test('byId', () => {
    expect(toList().byId(42)).toBeUndefined();
    const devs = toList([Dev.Naoufal, Dev.Jeroen, Dev.Wouter, Dev.Sander]);
    expect(devs.byId(Dev.Sander.id)).toBe(Dev.Sander);
    const food = toList('hamburger', 'pizza', 'fries');
    expect(food.byId(42)).toBeUndefined();
  });

  test('ById with string and number as Id works', () => {
    const numberAsId: Id = 41;
    const stringAsId: Id = '41';
    expect(toList({ id: numberAsId }).byId(stringAsId)).toMatchObject({ id: 41 });
    expect(toList({ id: stringAsId }).byId(numberAsId)).toMatchObject({ id: '41' });
    expect(toList({ id: '41' }).byId(numberAsId)).toMatchObject({ id: '41' });
    expect(toList({ id: '41' }).byId(stringAsId)).toMatchObject({ id: '41' });
    expect(toList({ id: 41 }).byId(numberAsId)).toMatchObject({ id: 41 });
    expect(toList({ id: 41 }).byId(stringAsId)).toMatchObject({ id: 41 });
  });

  test('remove', () => {
    expect(toList().remove(Dev.Rob)).toHaveLength(0);
    expect(toList(Dev.Sander).remove(Dev.Rob)).toHaveLength(1);
    expect(toList(Dev.Sander, Dev.Naoufal).remove(Dev.Rob)).toHaveLength(2);
    expect(toList({ name: 'Joyce' }, { name: 'Claudia' }).remove(Dev.Rob)).toHaveLength(2);
    expect(toList(Dev.Wouter, Dev.Jeroen).remove(Dev.Jeroen)).toHaveLength(1);
    expect(toList(Dev.Wouter, Dev.Jeroen).remove(Dev.Jeroen).remove(Dev.Jeroen)).toHaveLength(1);
    expect(toList(Dev.Wouter, Dev.Jeroen).remove(Dev.Jeroen).remove(Dev.Wouter)).toHaveLength(0);
  });

  test('switch', () => {
    const list = toList().switch(Dev.Rob);
    expect(list).toHaveLength(1);
    const l2 = list.switch(Dev.Sander);
    expect(l2).toHaveLength(2);
    const l3 = l2.switch(Dev.Rob);
    expect(l3).toHaveLength(1);
  });
});

describe('asList', () => {
  test('from undefined', () => {
    expect(asList(Dev, undefined).first()).toBeUndefined();
    expect(asList(Dev, []).first()).toBeUndefined();
  });

  test('from devs works', () => {
    expect(asList(Dev, [Dev.Naoufal.toJSON()]).first()).toMatchJson(Dev.Naoufal);
  });

  test('next on empty list works', () => {
    expect(asList(Dev).next(d => d.is(Dev.Wouter))).toBeUndefined();
  });

  test('prev on empty list works', () => {
    expect(asList(Dev).prev(d => d.is(Dev.Wouter))).toBeUndefined();
  });

  test('asList on empty list works', () => {
    expect(asList(Dev).prev(d => d.is(Dev.Wouter))).toBeUndefined();
  });

  type HasId = { id: Id };
  const hasId: HasId = { id: 42 };
  const stringMe = (s: HasId[] | List<HasId>): string => s[0].id.toString();

  class WithId extends Enum {
    static Hoi = new WithId('hoi');
  }

  test('Advanced use', () => {
    expect(stringMe([hasId])).toMatchText('42');
    expect(stringMe([Dev.Naoufal])).toMatchText(Dev.Naoufal.id);
    expect(stringMe(toList(hasId))).toMatchText('42');
    expect(stringMe(toList(WithId.Hoi))).toMatchText('hoi');
    expect(stringMe(toList(Dev.Naoufal))).toMatchText(Dev.Naoufal.id);
  });

  test('map', () => {
    const l = toList<Dev>(Dev.Naoufal, Dev.Rob, Dev.Wouter);
    const m = l.map(d => d.name);
    expect(m).toBeInstanceOf(List);
    expect(m).toHaveLength(3);
  });

  test('toList(number) => [number]', () => {
    const l = toList<Id>([2]);
    expect(l).toHaveLength(1);
    expect(l[0]).toBe(2);
  });

  test('toList([string]) => [string]', () => {
    const l = toList<Id>(['hello']);
    expect(l).toHaveLength(1);
    expect(l[0]).toBe('hello');
  });

  test('toList(string) => [string]', () => {
    const l = toList<Id>('hello');
    expect(l).toHaveLength(1);
    expect(l[0]).toBe('hello');
  });

  test('map returns [number]', () => {
    const entities = toList<Dev>(Dev.RobC);
    expect(entities.map(e => e.id)).toHaveLength(1);
    expect(entities.map(e => e.id)[0]).toBe(6);
  });

  test('sort with two', () => {
    const list = toList([
      { id: 1, name: 'sander' },
      { id: 2, name: 'wouter' },
      { id: 1, name: 'jeroen' },
      {
        id: 3,
        name: 'arnold',
      },
    ]);
    const sorted = list.asc(i => i.id || i.name);
    expect(sorted[0].id).toBe(1);
    expect(sorted[0].name).toBe('jeroen');
    const sorted2 = list.desc(i => i.id || i.name);
    expect(sorted2[0].id).toBe(3);
    expect(sorted2[0].name).toBe('arnold');
  });

  class Item {
    readonly amount = 2;
    readonly quantity = 42;
  }

  test('sum', () => {
    const items = toList(new Item(), new Item());
    expect(items.sum(() => 42)).toBe(84);
    expect(items.sum(i => i.quantity)).toBe(84);
    expect(items.sum(i => i.quantity * i.amount)).toBe(168);

    expect(toList().sum(() => 23)).toBe(0);
  });

  const item1 = { amount: 3, discount: 32, name: 'sander', live: true };
  const item2 = { amount: 1, discount: 42, name: 'rob', live: false };

  test('max', () => {
    const items = toList(item1, item2);

    expect(items.max('amount')).toBe(item1);
    expect(items.max('discount')).toBe(item2);
    expect(items.max('name')).toBe(item1);
    expect(items.max('live')).toBe(item1);
  });

  test('min', () => {
    const items = toList(item1, item2);

    expect(items.min('amount')).toBe(item2);
    expect(items.min('discount')).toBe(item1);
    expect(items.min('name')).toBe(item2);
    expect(items.min('live')).toBe(item2);
  });

  test('maxValue', () => {
    const items = toList(item1, item2);

    expect(maxValue(items, 'amount')).toBe(3);
    expect(maxValue(items, 'discount')).toBe(42);
    expect(maxValue(items, 'name')).toBe('sander');
    expect(maxValue(items, 'live')).toBe(true);
  });

  test('minValue', () => {
    const items = toList(item1, item2);

    expect(minValue(items, 'amount')).toBe(1);
    expect(minValue(items, 'discount')).toBe(32);
    expect(minValue(items, 'name')).toBe('rob');
    expect(minValue(items, 'live')).toBe(false);
  });

  test('firstItem', () => {
    const list = toList<{ id?: number; age?: number; name?: string }>(
      { name: 'sander' },
      { name: 'wouter' },
      {
        id: 1,
        name: 'jeroen',
      }
    );
    expect(list.firstValue(i => i.name)).toBe('sander');
    expect(list.firstValue(i => i.id)).toBe(1);
    expect(list.firstValue(i => i.age, 42)).toBe(42);
  });

  const listToArray = <T>(ts: T[]): T[] => ts;

  test('list to Array', () => {
    const devs = Dev.All;
    expect(listToArray(devs)).toHaveLength(Dev.All.length);
  });

  test('toObject works', () => {
    const devs = Dev.All;
    const a = devs.toObject('name');
    expect(a['Jeroen']).toMatchObject(Dev.Jeroen);
  });

  test('toObject works on Json', () => {
    const devs = toList(Dev.All.toJSON());
    const a = devs.toObject('name');
    expect(a['Jeroen']).toMatchJson(Dev.Jeroen);
  });

  test('toObjectList works on Json', () => {
    const devs = toList(Dev.Jeroen, Dev.Sander, Dev.Jeroen, Dev.Rob, Dev.Sander, Dev.Jeroen);
    const a = devs.toObjectList('id');
    expect(a[Dev.Jeroen.id]).toHaveLength(3);
    expect(a[Dev.Sander.id]).toHaveLength(2);
    expect(a[Dev.Rob.id]).toHaveLength(1);
    expect(a[Dev.Wouter.id]).toBeUndefined();
  });

  test('slice', () => {
    const devs = toList(Dev.Jeroen, Dev.Sander, Dev.Jeroen, Dev.Rob, Dev.Sander, Dev.Jeroen);
    const devs2 = devs.slice(0, 2);
    expect(isList(devs2)).toBeTruthy();
    expect(devs2).toHaveLength(2);
  });

  test('ids', () => {
    const ns = toList('Sander', 'Jeroen');
    expect(ns.ids).toHaveLength(0);
    const cs = toList({ name: 'Sander' }, { name: 'Jeroen' });
    expect(cs.ids).toHaveLength(0);
    const devs = toList(Dev.Jeroen, Dev.Sander, Dev.Jeroen, Dev.Rob, Dev.Sander, Dev.Jeroen);
    expect(devs.ids.join(',')).toBe('1,3,1,5,3,1');
  });

  test('chunk', () => {
    const devs = toList(Dev.Jeroen, Dev.Sander, Dev.Wouter, Dev.Rob, Dev.RobC, Dev.Eugen, Dev.Naoufal);
    const devs2 = devs.chunk(2);
    expect(isList(devs2)).toBeTruthy();
    expect(devs2).toHaveLength(4);
    expect(devs2[0]).toHaveLength(2);
    expect(devs2[1]).toHaveLength(2);
    expect(devs2[2]).toHaveLength(2);
    expect(devs2[3]).toHaveLength(1);
  });
});

describe('List.accumulate', () => {
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

    const acc = toList(data).accumulate('app', 'website');
    acc.map((d, i) => expect(d).toMatchObject(accumulatedData[i]));
  });
});

describe('update', () => {
  test('update', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal);
    const updated = devs.update(d => d.id === Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
  });

  test('update with lamda as value', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal);
    const updated = devs.update(
      d => d.id === Dev.Jeroen.id,
      d => d.update({ name: 'Rob' })
    );
    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
  });

  test('update updates many', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.update(d => d.id === Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Rob');
  });

  test('update updates many with lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.update(
      d => d.id === Dev.Jeroen.id,
      d => d.update({ name: 'Rob' })
    );
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Rob');
  });

  test('update with index', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.update((d, i) => d.id === Dev.Jeroen.id && i < 1, Dev.Rob);
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  test('update with index and lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.update(
      (d, i) => d.id === Dev.Jeroen.id && i < 1,
      d => d.update({ name: 'Rob' })
    );
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  test('update first', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateFirst(d => d.id === Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  test('update first with lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateFirst(
      d => d.id === Dev.Jeroen.id,
      d => d.update({ name: 'Rob' })
    );
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  test('update by id', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal);
    const updated = devs.updateById(Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
  });

  test('update by id with lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal);
    const updated = devs.updateById(Dev.Jeroen.id, d => d.update({ name: 'Rob' }));
    expect(updated).toHaveLength(2);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
  });

  test('update updates by id', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateById(Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Rob');
  });

  test('update updates by id with lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateById(Dev.Jeroen.id, d => d.update({ name: 'Rob' }));
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Rob');
  });

  test('update first by id', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateFirstById(Dev.Jeroen.id, Dev.Rob);
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  test('update first by id with lambda', () => {
    const devs = toList(Dev.Jeroen, Dev.Naoufal, Dev.Jeroen);
    const updated = devs.updateFirstById(Dev.Jeroen.id, d => d.update({ name: 'Rob' }));
    expect(updated).toHaveLength(3);
    expect(updated[0].name).toBe('Rob');
    expect(updated[1].name).toBe('Naoufal');
    expect(updated[2].name).toBe('Jeroen');
  });

  type Animal = { name: string; age: number };

  test('type checker allows narrowing of type', () => {
    type Cat = Animal & { meow: boolean };
    const cats = toList<Cat>();
    const animalHandler = (a: List<Animal>) => a;

    expect(animalHandler(cats)).toBe(cats);
  });

  test('diffByKey works with different types', () => {
    const devs = toList(Dev.Naoufal, Dev.Jeroen);
    const a = toList<Animal>({ name: 'Naoufal', age: 42 });
    const diff = devs.diffByKey(a, 'name');
    expect(diff).toHaveLength(1);
    expect(diff.first()).toBe(Dev.Jeroen);
  });
});
