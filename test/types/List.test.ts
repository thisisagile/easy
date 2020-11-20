import { Dev } from '../ref/Dev';
import { isList, List, list, toList } from '../../src/types/List';

describe('List', () => {

  const devs = list([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);

  test('list from spread', () => {
    const l = list(Dev.Sander, Dev.Jeroen);
    expect(l).toHaveLength(2);
    expect(l).toBeInstanceOf(List);
  });

  test('list from array', () => {
    expect(devs).toHaveLength(devs.length);
    expect(devs).toBeInstanceOf(List);
  });

  test('list from list', () => {
    expect(list()).toHaveLength(0);
    expect(list([])).toHaveLength(0);
    expect(list(devs)).toHaveLength(devs.length);
    expect(list(devs)).toBeInstanceOf(List);
  });

  test('asc and desc', () => {
    expect(devs.asc('name').last()).toMatchObject(Dev.Wouter);
    expect(devs.desc(d => d.name).first()).toMatchObject(Dev.Wouter);
  });

  test('map', () => {
    expect(devs.map(d => d.language)).toBeInstanceOf(List);
    expect(devs.asc('name').map(d => d.name).first()).toBe(Dev.Jeroen.name);
  });

  test('mapDefined', () => {
    const devs = list([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Invalid]).mapDefined(d => d.name);
    expect(devs).toBeInstanceOf(List);
    expect(devs).toHaveLength(3);
  });

  test('filter', () => {
    const devs = list([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]).filter(d => d.name.includes('a'));
    expect(devs).toBeInstanceOf(List);
    expect(devs).toHaveLength(2);
  });

  test('first', () => {
    const devs = list([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(devs.first()).toMatchObject(Dev.Sander);
    expect(devs.first(d => d.name === Dev.Jeroen.name)).toMatchObject(Dev.Jeroen);
    expect(devs.first(d => d.name === 'Rene')).toBeUndefined();
  });

  test('last', () => {
    const devs = list([Dev.Sander, Dev.Wouter, Dev.Jeroen, Dev.Naoufal]);
    expect(devs.last()).toMatchObject(Dev.Naoufal);
    expect(devs.last(d => d.name === Dev.Jeroen.name)).toMatchObject(Dev.Jeroen);
    expect(devs.last(d => d.name === 'Rene')).toBeUndefined();
  });

  test('concat', () => {
    const devs = list(Dev.Sander, Dev.Wouter);
    expect(devs.concat()).toBeInstanceOf(List);
    expect(devs.concat()).toHaveLength(2);
    expect(devs.concat([])).toHaveLength(2);
    expect(devs.concat([Dev.Naoufal])).toHaveLength(3);
    expect(devs.concat(list(Dev.Naoufal, Dev.Jeroen))).toHaveLength(4);
  });

  test('add', () => {
    const devs = list(Dev.Sander, Dev.Wouter);
    expect(devs.add()).toBeInstanceOf(List);
    expect(devs.add()).toHaveLength(2);
    expect(devs.add([])).toHaveLength(2);
    expect(devs.add(Dev.Naoufal)).toHaveLength(3);
    expect(devs.add([Dev.Naoufal])).toHaveLength(3);
    expect(devs.add(list(Dev.Naoufal))).toHaveLength(3);
    expect(devs.add(list(Dev.Naoufal, Dev.Jeroen))).toHaveLength(4);
  });

  test('toJSON', () => {
    const json = list(Dev.Sander, Dev.Wouter).toJSON();
    expect(JSON.stringify(json)).toBe(JSON.stringify((list(Dev.Sander.toJSON(), Dev.Wouter.toJSON()))));
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
    expect(isList<Dev>(list(Dev.Sander, Dev.Jeroen))).toBeTruthy();
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

  test('from single item', () => {
    const l = toList(Dev.Naoufal);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(1);
  });

  test('from two items', () => {
    const l = toList(Dev.Sander, Dev.Jeroen);
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
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
    const l = toList(list(Dev.Naoufal, Dev.Jeroen));
    expect(isList(l)).toBeTruthy();
    expect(l).toHaveLength(2);
  });
});


