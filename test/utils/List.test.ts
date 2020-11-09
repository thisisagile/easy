import { Dev } from '../ref/Dev';
import { list, List } from '../../src/utils';

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
