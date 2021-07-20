import { Dev, devData, DevMap, TesterMap } from '../ref';
import { isUuid, Mapper, toId } from '../../src';

describe('Mapper', () => {
  const empty = new Mapper();
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
    readonly id = this.map.item('Id', { dflt: () => toId() });
  }

  test('map.from without id, so it uses default function', () => {
    const j = new DevMapWithFunction().in(devData.withoutId);
    expect(isUuid(j.id?.toString())).toBeTruthy();
  });

  class IgnoreMap extends Mapper {
    readonly level = this.map.ignore();
  }

  test('ignore should remove props', () => {
    const im = new IgnoreMap();
    expect(im.in({ level: 3 })).toStrictEqual({});
  });

  class Business extends Mapper {
    readonly name = this.map.item('Name');
    readonly site = this.map.item('WebSite');
  }

  class Manager extends Mapper {
    readonly name = this.map.item('Manager');
    readonly title = this.map.item('ManagerTitle');
  }

  class MapWithSubMap extends Mapper {
    readonly name = this.map.item('Name');
    readonly company = this.map.map(new Business({ startFrom: 'scratch' }), 'Business');
    readonly manager = this.map.map(Manager);
  }

  const original = { Name: 'Sander', Business: { Name: 'ditisagile.nl', WebSite: 'www.ditisagile.nl' }, Manager: 'Rogier', ManagerTitle: 'COO' };
  const mapped = { name: 'Sander', company: { name: 'ditisagile.nl', site: 'www.ditisagile.nl' }, manager: { name: 'Rogier', title: 'COO' } };

  test('using map properties works', () => {
    const map = new MapWithSubMap({ startFrom: 'scratch' });
    expect(map.in(original)).toStrictEqual(mapped);
  });

  class MapWithList extends Mapper {
    readonly name = this.map.item('Name');
    readonly company = this.map.map(new Business({ startFrom: 'scratch' }), 'Business');
    readonly managers = this.map.list(new Manager(), 'Managers');
  }

  test('using map array works', () => {
    const original = {
      Name: 'iBood',
      Business: { Name: 'iBood', WebSite: 'www.ibood.com' },
      Managers: [
        { Manager: 'Rogier', ManagerTitle: 'COO' },
        { Manager: 'Sander', ManagerTitle: 'CTO' },
      ],
    };
    const mapped = {
      name: 'iBood',
      company: { name: 'iBood', site: 'www.ibood.com' },
      managers: [
        { name: 'Rogier', title: 'COO' },
        { name: 'Sander', title: 'CTO' },
      ],
    };
    const map = new MapWithList({ startFrom: 'scratch' });
    expect(map.in(original)).toStrictEqual(mapped);
    expect(map.out(mapped)).toStrictEqual(original);
  });
});
