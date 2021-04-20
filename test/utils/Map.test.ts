import { Dev, devData, DevMap, TesterMap } from '../ref';
import { isUuid, Map, toId } from '../../src';

describe('Map', () => {
  const empty = new Map();
  const dev = new DevMap();
  const tester = new TesterMap();

  test('properties are correct', () => {
    expect(dev.id.options?.convert).toBeDefined();
    expect(dev.id.options?.dflt).toBe(42);
  });

  test('count properties', () => {
    expect(empty.properties).toHaveLength(0);
    expect(dev.properties).toHaveLength(3);
    expect(tester.properties).toHaveLength(4);
  });

  test('empty map.from with undefined is undefined', () => {
    expect(empty.in()).toMatchObject({});
  });

  test('empty map.to with undefined is undefined', () => {
    expect(empty.out()).toMatchObject({});
  });

  test('empty map.from is correct', () => {
    expect(empty.in(devData.jeroen)).toMatchObject({});
  });

  test('empty map.to is correct', () => {
    expect(empty.out(devData.jeroen)).toMatchObject({});
  });

  test('map.to is correct', () => {
    const j = dev.out(Dev.Jeroen.toJSON());
    expect(j).toEqual({ Id: 1, Name: 'Jeroen', CodingLevel: '3' });
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
    readonly id = this.prop('Id', { dflt: () => toId() });
  }

  test('map.from without id, so it uses default function', () => {
    const j = new DevMapWithFunction().in(devData.withoutId);
    expect(isUuid(j.id?.toString())).toBeTruthy();
  });

  class IgnoreMap extends Map {
    readonly level = this.ignore;
  }

  test('ignore should remove props', () => {
    const im = new IgnoreMap();
    expect(im.in({ level: 3 })).toStrictEqual({});
  });

  class Business extends Map {
    readonly name = this.prop('Name');
    readonly site = this.prop('WebSite');
  }

  class Manager extends Map {
    readonly name = this.prop('Manager');
    readonly title = this.prop('ManagerTitle');
  }

  class MapWithSubMap extends Map {
    readonly name = this.prop('Name');
    readonly company = this.map(new Business({ startFrom: 'scratch' }), 'Business');
    readonly manager = this.map(new Manager({ startFrom: 'scratch' }));
  }

  const original = { Name: 'Sander', Business: { Name: 'ditisagile.nl', WebSite: 'www.ditisagile.nl' }, Manager: 'Rogier', ManagerTitle: 'COO' };
  const mapped = { name: 'Sander', company: { name: 'ditisagile.nl', site: 'www.ditisagile.nl' }, manager: { name: 'Rogier', title: 'COO' } };

  test('using map properties works', () => {
    const map = new MapWithSubMap({ startFrom: 'scratch' });
    expect(map.in(original)).toStrictEqual(mapped);
  });
});
