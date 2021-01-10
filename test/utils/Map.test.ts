import { Dev, devData, DevMap, TesterMap } from '../ref';
import { convert, Map, col } from '../../src';

describe('prop', () => {
  const map = new DevMap();

  test('Simple prop', () => {
    const p = col(map, 'Id');
    expect(p).toMatchObject({ name: 'Id', default: undefined, converter: convert.default });
  });

  test('Prop with empty options', () => {
    const p = col(map, 'Id', {});
    expect(p).toMatchObject({ name: 'Id', default: undefined, converter: convert.default });
  });

  test('Prop with default', () => {
    const p = col(map, 'Id', { default: 3 });
    expect(p).toMatchObject({ name: 'Id', default: 3, converter: convert.default });
  });

  test('Prop with default and converter', () => {
    const p = col(map, 'Id', { default: 3, converter: convert.toNumber.fromString });
    expect(p).toMatchObject({ name: 'Id', default: 3, converter: convert.toNumber.fromString });
  });
});

describe('Map', () => {
  const empty = new Map();
  const dev = new DevMap();
  const tester = new TesterMap();

  test('count properties', () => {
    expect(empty.columns).toHaveLength(0);
    expect(dev.columns).toHaveLength(3);
    expect(tester.columns).toHaveLength(4);
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

  test('map.from without id uses default', () => {
    const j = dev.in(devData.withoutId);
    expect(j).toEqual({ id: 42, name: 'Sander', level: 3 });
  });
});
