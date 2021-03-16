import { Dev, devData, DevMap, TesterMap } from '../ref';
import { isUuid, Map, toId } from '../../src';

describe('Map', () => {
  const empty = new Map();
  const dev = new DevMap();
  const tester = new TesterMap();

  test('properties are correct', () => {
    expect(dev.id.options?.convert).toBeDefined();
    expect(dev.id.options?.def).toBe(42);
  });

  test('count properties', () => {
    expect(empty.properties).toHaveLength(0);
    expect(dev.properties).toHaveLength(3);
    expect(tester.properties).toHaveLength(4);
  });

  test('empty map.from with undefined is undefined', () => {
    const j = empty.in();
    expect(j).toMatchObject({});
  });

  test('empty map.to with undefined is undefined', () => {
    const j = empty.out();
    expect(j).toMatchObject({});
  });

  test('empty map.from is correct', () => {
    const j = empty.in(devData.jeroen);
    expect(j).toMatchObject(devData.jeroen);
  });

  test('empty map.to is correct', () => {
    const j = empty.out(devData.jeroen);
    expect(j).toMatchObject(devData.jeroen);
  });

  test('map.to is correct', () => {
    const j = dev.out(Dev.Jeroen.toJSON());
    expect(j).toEqual({ Id: 1, language: 'TypeScript', Name: 'Jeroen', CodingLevel: '3' });
  });

  test('map.from is correct', () => {
    const j = dev.in(devData.jeroen);
    expect(j).toEqual({ id: 54, name: 'Jeroen', level: 3 });
  });

  test('map.from without id, so it uses default value', () => {
    const j = dev.in(devData.withoutId);
    expect(j).toEqual({ id: 42, name: 'Sander', level: 3 });
  });

  class DevMapWithFunction extends DevMap {
    readonly id = this.prop('Id', { def: () => toId() });
  }

  test('map.from without id, so it uses default function', () => {
    const j = new DevMapWithFunction().in(devData.withoutId);
    expect(isUuid(j.id?.toString())).toBeTruthy();
  });
});
