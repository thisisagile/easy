import { DevMap } from '../ref';
import { convert, toProperty } from '../../src';

describe('toProperty', () => {
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
