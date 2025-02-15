import { array, OneOrMore, toArray, toObject } from '../../src';
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

  const oneOrMore = (a: OneOrMore<unknown>): string => toArray(a).join(',');

  test('with OneOrMore', () => {
    expect(oneOrMore(Dev.Sander)).toBe('Sander');
    expect(oneOrMore([Dev.Sander, Dev.Rob])).toBe('Sander,Rob');
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
      [
        '2nd array matches with default 1st key',
        first,
        second,
        undefined,
        'id',
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'H',
        },
      ],
      [
        '2nd array matches with default 2nd key',
        first,
        second,
        'id',
        undefined,
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'H',
        },
      ],
      [
        '2nd array matches with two default keys',
        first,
        second,
        undefined,
        undefined,
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'H',
        },
      ],
      [
        '2nd array matches with keys id',
        first,
        second,
        'id',
        'id',
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'H',
        },
      ],
      ['2nd array with non-existing key', first, second, '', 'last', first.length, first[0]],
      [
        '2nd array matches',
        first,
        [{ id: 3, last: 'Ho' }],
        'id',
        'id',
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'Ho',
        },
      ],
      [
        '2nd array matches on another key',
        first,
        [{ key: 3, last: 'Ho' }],
        'id',
        'key',
        first.length,
        {
          id: 3,
          first: 'Sander',
          last: 'Ho',
        },
      ],
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

    test('swap adding item', () => {
      const ls = [Dev.Naoufal, Dev.Jeroen, Dev.Wouter];
      const ls2 = array.switch(ls, Dev.Sander);
      expect(ls).toHaveLength(3);
      expect(ls2).toHaveLength(4);
    });

    test('swap adding item where items is undefined', () => {
      const ls = undefined as unknown as Dev[];
      const ls2 = array.switch(ls, Dev.Sander);
      expect(ls).toBeUndefined();
      expect(ls2).toHaveLength(1);
    });

    test('swap removing item', () => {
      const ls = [Dev.Naoufal, Dev.Jeroen, Dev.Wouter];
      const ls2 = array.switch(ls, Dev.Jeroen);
      expect(ls).toHaveLength(3);
      expect(ls2).toHaveLength(2);
    });

    const devs = [Dev.Naoufal, Dev.Jeroen, Dev.Wouter, Dev.Sander, Dev.Rob, Dev.RobC];

    test('splitIn with undefined array', () => {
      const [a, b] = array.splitIn(undefined as unknown as Dev[], 2);
      expect(a).toHaveLength(0);
      expect(b).toHaveLength(0);
    });

    test('splitIn with empty array', () => {
      const [a, b] = array.splitIn([], 2);
      expect(a).toHaveLength(0);
      expect(b).toHaveLength(0);
    });

    test('splitIn with array of 1', () => {
      const [a, b] = array.splitIn([Dev.Naoufal], 2);
      expect(a).toHaveLength(1);
      expect(b).toHaveLength(0);
    });

    test('splitIn with array of 2', () => {
      const [a, b] = array.splitIn([Dev.Naoufal, Dev.Jeroen], 2);
      expect(a).toHaveLength(1);
      expect(b).toHaveLength(1);
    });

    test('splitIn with array of 3', () => {
      const [a, b] = array.splitIn([Dev.Naoufal, Dev.Jeroen, Dev.Wouter], 2);
      expect(a).toHaveLength(2);
      expect(b).toHaveLength(1);
    });

    test('splitIn in 3 parts', () => {
      const [a, b, c] = array.splitIn(devs, 3);
      expect(a).toHaveLength(2);
      expect(b).toHaveLength(2);
      expect(c).toHaveLength(2);
    });

    test('splitIn by default splits into 2', () => {
      const [a, b] = array.splitIn([Dev.Naoufal, Dev.Jeroen]);
      expect(a).toHaveLength(1);
      expect(b).toHaveLength(1);
    });

    test('split in is round robin?', () => {
      const [a, b] = array.splitIn([1, 2, 3, 4, 5, 6, 7]);
      expect(a).toMatchObject([1, 3, 5, 7]);
      expect(b).toMatchObject([2, 4, 6]);
    });

    test('chunk empty', () => {
      const [a] = array.chunk();
      expect(a).toBeUndefined();
    });

    test('chunk empty array', () => {
      const [a] = array.chunk([]);
      expect(a).toBeUndefined();
    });

    test('chunk default chunk size', () => {
      const [a, b] = array.chunk([1, 2, 3, 4, 5, 6, 7]);
      expect(a).toMatchObject([1, 2, 3, 4]);
      expect(b).toMatchObject([5, 6, 7]);
    });

    test('chunk is not in round robin', () => {
      const [a, b, c] = array.chunk([1, 2, 3, 4, 5, 6, 7], 3);
      expect(a).toMatchObject([1, 2, 3]);
      expect(b).toMatchObject([4, 5, 6]);
      expect(c).toMatchObject([7]);
    });
  });
});
