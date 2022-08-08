import { array, toArray, toObject } from '../../src';
import { Dev } from '../ref';

describe('toArray', () => {
  test('from nothing', () => {
    expect(toArray()).toHaveLength(0);
  });

  test('from undefined', () => {
    expect(toArray(undefined)).toHaveLength(0);
  });

  test('from null', () => {
    expect(toArray(null)).toHaveLength(0);
  });

  test('from single item', () => {
    expect(toArray(Dev.Sander)).toHaveLength(1);
  });

  test('from two items', () => {
    expect(toArray(Dev.Sander, Dev.Jeroen)).toHaveLength(2);
  });

  test('from array of two items', () => {
    expect(toArray([Dev.Sander, Dev.Jeroen])).toHaveLength(2);
  });

  test('from spread of two items', () => {
    const spread = [Dev.Sander, Dev.Jeroen];
    expect(toArray(...spread)).toHaveLength(2);
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
      [Dev.Rob.id]: Dev.Rob,
      [Dev.RobC.id]: Dev.RobC,
    });
  });
});

describe('array', () => {
  const first = [
    { id: 3, first: 'Sander' },
    { id: 4, first: 'Jeroen' },
    { id: 5, last: 'Wouter' },
  ];
  const second = [
    { id: 3, last: 'H' },
    { id: 4, last: 'P' },
    { id: 5, last: 'B' },
  ];
  const third = [
    { key: 3, last: 'H' },
    { key: 4, last: 'P' },
    { key: 5, last: 'B' },
  ];

  test.each([
    ['undefined arrays', undefined, undefined, '', '', 0, {}],
    ['1st array undefined', undefined, [], '', '', 0, {}],
    ['2nd array undefined', [], undefined, '', '', 0, {}],
    ['2nd array empty', first, [], '', '', first.length, first[0]],
    ['2nd array misses key', first, [{ last: 'Ho' }], '', '', first.length, first[0]],
    ['arrays dont have the right ids', first, [{ id: 42, last: 'Ho' }], 'wrong', 'wrong', first.length, first[0]],
    ['2nd array matches with default 1st key', first, second, undefined, 'id', first.length, { id: 3, first: 'Sander', last: 'H' }],
    ['2nd array matches with default 2nd key', first, second, 'id', undefined, first.length, { id: 3, first: 'Sander', last: 'H' }],
    ['2nd array matches with two default keys', first, second, undefined, undefined, first.length, { id: 3, first: 'Sander', last: 'H' }],
    ['2nd array matches with keys id', first, second, 'id', 'id', first.length, { id: 3, first: 'Sander', last: 'H' }],
    ['2nd array with non-existing key', first, second, '', 'last', first.length, first[0]],
    ['2nd array matches', first, [{ id: 3, last: 'Ho' }], 'id', 'id', first.length, { id: 3, first: 'Sander', last: 'Ho' }],
    ['2nd array matches on another key', first, [{ key: 3, last: 'Ho' }], 'id', 'key', first.length, { id: 3, first: 'Sander', last: 'Ho' }],
  ])('Matching arrays with %s', (name, f, s, kf, ks, l, e) => {
    const m = array.merge(f, s, kf, ks);
    expect(m).toHaveLength(l);
    expect(m[0] ?? {}).toMatchObject(e as any);
  });

  test('final check', () => {
    const m = array.merge(first, second);
    expect(m).toHaveLength(first.length);
    expect(m[2].last).toBe(second[2].last);
  });

  test('final check with different keys', () => {
    const m = array.merge(first, third, 'id', 'key');
    expect(m).toHaveLength(first.length);
    expect(m[2].last).toBe(second[2].last);
  });
});
