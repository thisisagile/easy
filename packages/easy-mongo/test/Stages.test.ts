import { stages } from '../src';
import { fits } from '@thisisagile/easy-test';

describe('Stages', () => {
  // Decode
  const { decode } = stages;

  test('decode id', () => {
    expect(decode.id('brandId')).toBe('$brandId');
    expect(decode.id(42)).toBe(42);
    expect(decode.id(true)).toBe(true);
    expect(decode.id({ total: 42 })).toBe(42);
    expect(decode.id({ total: count() })).toStrictEqual({ $count: {} });
  });

  test('decode fields', () => {
    expect(decode.fields({ total: 42 })).toStrictEqual({ total: 42 });
    expect(decode.fields({ total: count() })).toStrictEqual({ total: { $count: {} } });
  });

  // Match
  const { match, gt, gte, lt, lte, after, before, anywhere } = stages.match;

  test('one filter', () => {
    expect(match({ id: 42 })).toStrictEqual({ $match: { id: 42 } });
    expect(match({ name: 'Sander' })).toStrictEqual({ $match: { name: 'Sander' } });
    expect(
      match({
        name: 'Sander',
        promoted: undefined,
      })
    ).toStrictEqual({ $match: { name: 'Sander' } });
  });

  test('multiple filters', () => {
    expect(match({ id: 42, name: 'Sander' })).toStrictEqual({ $match: { id: 42, name: 'Sander' } });
  });

  test('gt', () => {
    expect(match({ id: gt(42) })).toStrictEqual({ $match: { id: { $gt: 42 } } });
  });

  test('gte', () => {
    expect(match({ id: gte(42) })).toStrictEqual({ $match: { id: { $gte: 42 } } });
  });

  test('lt', () => {
    expect(match({ id: lt(42) })).toStrictEqual({ $match: { id: { $lt: 42 } } });
  });

  test('lte', () => {
    expect(match({ id: lte(42) })).toStrictEqual({ $match: { id: { $lte: 42 } } });
  });

  test('anywhere', () => {
    expect(match({ name: anywhere('sander') })).toStrictEqual({ $match: { name: { $regex: 'sander', $options: 'i' } } });
    expect(match({ name: anywhere('sa/n&d(er') })).toStrictEqual({ $match: { name: { $regex: 'sa/n&d\\(er', $options: 'i' } } });
  });

  test('after', () => {
    expect(match({ 'deleted.when': after('2021-06-24T00:00:00.000Z') })).toStrictEqual({
      $match: { 'deleted.when': { $gte: fits.type(Date) } },
    });
  });

  test('before', () => {
    expect(match({ 'deleted.when': before('2021-06-24T00:00:00.000Z') })).toStrictEqual({
      $match: { 'deleted.when': { $lt: fits.type(Date) } },
    });
  });

  // Sort
  const { sort, asc, desc } = stages.sort;

  test('sort', () => {
    expect(sort({})).toBeUndefined();
    expect(sort({ name: -1 })).toStrictEqual({ $sort: { name: -1 } });
    expect(sort({ name: 1, email: -1 })).toStrictEqual({ $sort: { name: 1, email: -1 } });
  });

  test('asc', () => {
    expect(asc('name')).toStrictEqual({ $sort: { name: 1 } });
  });

  test('desc', () => {
    expect(desc('name')).toStrictEqual({ $sort: { name: -1 } });
  });

  // Group
  const { group, count, avg, sum, first, last, min, max, date, push } = stages.group;

  test('filter undefined', () => {
    expect(decode.fields({ total: count(), remove: undefined })).toStrictEqual({ total: { $count: {} } });
  });

  test('filter with function returning undefined', () => {
    expect(decode.fields({ total: count(), remove: () => undefined })).toStrictEqual({ total: { $count: {} } });
  });

  test('count', () => {
    expect(decode.fields({ total: count() })).toStrictEqual({ total: { $count: {} } });
  });

  test('avg', () => {
    expect(decode.fields({ total: avg('level') })).toStrictEqual({ total: { $avg: '$level' } });
  });

  test('sum', () => {
    expect(decode.fields({ total: sum('price') })).toStrictEqual({ total: { $sum: '$price' } });
  });

  test('first', () => {
    expect(decode.fields({ total: first('item') })).toStrictEqual({ total: { $first: '$item' } });
  });

  test('last', () => {
    expect(decode.fields({ total: last('item') })).toStrictEqual({ total: { $last: '$item' } });
  });

  test('min', () => {
    expect(decode.fields({ total: min('item') })).toStrictEqual({ total: { $min: '$item' } });
  });

  test('max', () => {
    expect(decode.fields({ total: max('item') })).toStrictEqual({ total: { $max: '$item' } });
  });

  test('groupBy string id and single field', () => {
    const g = group({ total: sum('count') }).by('brandId');
    expect(g).toStrictEqual({ $group: { _id: '$brandId', total: { $sum: '$count' } } });
  });

  test('groupBy id and push', () => {
    const g = group({ products: push() }).by('brandId');
    expect(g).toStrictEqual({ $group: { _id: '$brandId', products: { $push: '$$ROOT' } } });
  });

  test('groupBy string id and multiple fields', () => {
    const g = group({ total: sum('count'), count: count() }).by('brandId');
    expect(g).toStrictEqual({ $group: { _id: '$brandId', total: { $sum: '$count' }, count: { $count: {} } } });
  });

  test('groupBy filter id and single field', () => {
    const g = group({ count: count() }).by({ 'created.when': date() });
    expect(g).toStrictEqual({
      $group: {
        _id: { $dateToString: { date: '$created.when', format: '%Y-%m-%d' } },
        count: { $count: {} },
      },
    });
  });

  // Skip and take
  const options = { skip: 10, take: 5 };
  const { skip, take } = stages.skip;

  test('skip', () => {
    expect(skip()).toBeUndefined();
    expect(skip({})).toBeUndefined();
    expect(skip(options)).toStrictEqual({ $skip: options.skip });
  });

  test('take', () => {
    expect(take()).toBeUndefined();
    expect(take({})).toBeUndefined();
    expect(take(options)).toStrictEqual({ $limit: options.take });
  });

  // Search
  const { auto, search } = stages.search;

  test('auto', () => {
    expect(search({ name: auto('42') })).toStrictEqual({
      $search: {
        autocomplete: {
          query: ['42'],
          path: 'name',
        },
      },
    });
  });

  // Set
  const { set, score } = stages.set;

  test('score with an additional set', () => {
    expect(set({ score: score(), name: 'Sander' })).toStrictEqual({
      $set: {
        score: { $meta: 'searchScore' },
        name: 'Sander',
      },
    });
  });

  // Project
  const { include, exclude } = stages.project;

  test('projection include', () => {
    expect(include({ color: 1 })).toStrictEqual({ $projection: { color: 1 } });
    expect(include({})).toBeUndefined();
  });

  test('projection exclude', () => {
    expect(exclude({ color: 0 })).toStrictEqual({ $projection: { color: 0 } });
    expect(exclude({})).toBeUndefined();
  });
});
