import { Dev, devData, DevMap, TesterMap } from '../ref';
import { convert, Map, toProperty } from '../../src';

describe('prop', () => {
  const map = new DevMap();

  test('Simple prop', () => {
    const p = toProperty(map, 'Id');
    expect(p).toMatchObject({ name: 'Id', options: { def: undefined, convert: convert.default } });
  });

  test('Prop with empty options', () => {
    const p = toProperty(map, 'Id', {});
    expect(p).toMatchObject({ name: 'Id', options: { def: undefined, convert: convert.default } });
  });

  test('Prop with default', () => {
    const p = toProperty(map, 'Id', { def: 3 });
    expect(p).toMatchObject({ name: 'Id', options: { def: 3, convert: convert.default } });
  });

  test('Prop with default and converter', () => {
    const p = toProperty(map, 'Id', { def: 3, convert: convert.toNumber.fromString });
    expect(p).toMatchObject({ name: 'Id', options: { def: 3, convert: convert.toNumber.fromString } });
  });
});

describe('Map', () => {
  const empty = new Map();
  const dev = new DevMap();
  const tester = new TesterMap();

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

  test('map.from without id uses default', () => {
    const j = dev.in(devData.withoutId);
    expect(j).toEqual({ id: 42, name: 'Sander', level: 3 });
  });
});
