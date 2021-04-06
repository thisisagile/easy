import { DevMap } from '../ref';
import { clone, convert, toProperty } from '../../src';

describe('toProperty', () => {
  const map = new DevMap();

  test('Simple prop', () => {
    const p = toProperty(map, 'Id');
    expect(p).toMatchObject({ name: 'Id', options: { dflt: undefined, convert: convert.default } });
  });

  test('Prop with empty options', () => {
    const p = toProperty(map, 'Id', {});
    expect(p).toMatchObject({ name: 'Id', options: { dflt: undefined, convert: convert.default } });
  });

  test('Prop with default', () => {
    const p = toProperty(map, 'Id', { dflt: 3 });
    expect(p).toMatchObject({ name: 'Id', options: { dflt: 3, convert: convert.default } });
  });

  test('Prop with default and converter', () => {
    const p = toProperty(map, 'Id', { dflt: 3, convert: convert.toNumber.fromString });
    expect(p).toMatchObject({ name: 'Id', options: { dflt: 3, convert: convert.toNumber.fromString } });
  });
});

describe('clone', () => {
  const original = { id: 3, name: 'Jeroen', level: '3' };

  test('clone empty', () => {
    const c = clone({}, 'id', 'Id');
    expect(c).toMatchObject({});
  });

  test('clone empty with default value', () => {
    const c = clone({}, 'id', 'Id', 3);
    expect(c).toMatchObject({ Id: 3 });
  });

  test('clone empty with default function', () => {
    const c = clone({}, 'id', 'Id', () => 6);
    expect(c).toMatchObject({ Id: 6 });
  });

  test('clone valid', () => {
    const c = clone({ id: 4 }, 'id', 'Id');
    expect(c).toMatchObject({ Id: 4 });
  });

  test('clone valid with default value', () => {
    const c = clone({ id: 4 }, 'id', 'Id', 3);
    expect(c).toMatchObject({ Id: 4 });
  });

  test('clone valid with default function', () => {
    const c = clone({ id: 4 }, 'id', 'Id', () => 6);
    expect(c).toMatchObject({ Id: 4 });
  });

  test('clone same', () => {
    const c = clone({ id: 4 }, 'id', 'id');
    expect(c).toMatchObject({ id: 4 });
  });

  test('clone same with default value', () => {
    const c = clone({ id: 4 }, 'id', 'id', 3);
    expect(c).toMatchObject({ id: 4 });
  });

  test('clone same with default function', () => {
    const c = clone({ id: 4 }, 'id', 'id', () => 6);
    expect(c).toMatchObject({ id: 4 });
  });

  test('clone with full object', () => {
    const c = clone(original, 'id', 'Id', () => 6);
    expect(c).toMatchObject({ Id: 3, name: 'Jeroen', level: '3' });
  });

  test('clone same with full object', () => {
    const c = clone(original, 'id', 'id', 6);
    expect(c).toMatchObject({ id: 3, name: 'Jeroen', level: '3' });
  });
});
