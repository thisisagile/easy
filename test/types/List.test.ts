import { Dev } from '../ref';
import { asList, isList, List, Scope, toList, toObject } from '../../src';

describe('List', () => {
  const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);

  test('asc and desc', () => {
    expect(devs.asc('name').last()).toMatchObject(Dev.Wouter);
    expect(devs.asc('name').first()).toMatchObject(Dev.Jeroen);
    expect(devs.desc(d => d.name).first()).toMatchObject(Dev.Wouter);
    expect(devs.desc(d => d.name).last()).toMatchObject(Dev.Jeroen);
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

  test('mapDefined', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]).mapDefined(d => d.name);
    expect(devs).toBeInstanceOf(List);
    expect(devs).toHaveLength(3);
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
  });

  test('last', () => {
    const devs = toList([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(devs.last()).toMatchObject(Dev.Naoufal);
    expect(devs.last(d => d.name === Dev.Jeroen.name)).toMatchObject(Dev.Jeroen);
    expect(devs.last(d => d.name === 'Rene')).toBeUndefined();
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

  test('toJSON', () => {
    const json = toList(Dev.Sander, Dev.Wouter).toJSON();
    expect(json).not.toBeInstanceOf(List);
    expect(json).toBeInstanceOf(Array);
    expect(JSON.stringify(json)).toBe(JSON.stringify([Dev.Sander.toJSON(), Dev.Wouter.toJSON()]));
    const j = toList(Scope.Auth, Scope.Basic, Scope.Admin).toJSON();
    expect(JSON.stringify(j)).toBe(JSON.stringify([Scope.Auth.toJSON(), Scope.Basic.toJSON(), Scope.Admin.toJSON()]));
  });
});

describe('isList', () => {
  test('Is false', () => {
    expect(isList()).toBeFalsy();
    expect(isList({})).toBeFalsy();
    expect(isList([])).toBeFalsy();
    expect(
      isList<Dev>([Dev.Sander, Dev.Jeroen])
    ).toBeFalsy();
  });

  test('Is true', () => {
    expect(isList<Dev>(toList(Dev.Sander, Dev.Jeroen))).toBeTruthy();
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
});

describe('asList', () => {
  test('from undefined', () => {
    expect(asList(Dev, undefined).first()).toBeUndefined();
    expect(asList(Dev, []).first()).toBeUndefined();
  });

  test('from devs works', () => {
    expect(asList(Dev, [Dev.Naoufal.toJSON()]).first().toJSON()).toMatchObject(Dev.Naoufal.toJSON());
  });
});

describe('toObject', () => {
  test('from undefined works', () => {
    const res = toObject('id');
    expect(res).toStrictEqual({});
  });

  test('from single object works', () => {
    const res = toObject('id', Dev.Naoufal);
    expect(res[Dev.Naoufal.id]).toStrictEqual(Dev.Naoufal);
  });

  test('from a series of objects works', () => {
    const res = toObject('id', Dev.Naoufal, Dev.Jeroen, Dev.Wouter);
    expect(res).toStrictEqual({
      [Dev.Naoufal.id]: Dev.Naoufal,
      [Dev.Wouter.id]: Dev.Wouter,
      [Dev.Jeroen.id]: Dev.Jeroen,
    });
  });

  test('from a list of objects works', () => {
    const res = toObject('id', Dev.All);
    expect(res).toStrictEqual({
      [Dev.Naoufal.id]: Dev.Naoufal,
      [Dev.Wouter.id]: Dev.Wouter,
      [Dev.Sander.id]: Dev.Sander,
      [Dev.Jeroen.id]: Dev.Jeroen,
    });
  });
});
