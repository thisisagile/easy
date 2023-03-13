import { stages } from '../src';
import { fits } from '@thisisagile/easy-test';

describe('Stages', () => {
  // Decode
  const { decode } = stages;

  test('decode id', () => {
    expect(decode.id('brandId')).toBe('brandId');
    expect(decode.id({ total: 42 })).toBe(42);
    expect(decode.id({ total: count() })).toMatchObject({ $count: {} });
  });

  test('decode fields', () => {
    expect(decode.fields({ total: 42 })).toMatchObject({ total: 42 });
    expect(decode.fields({ total: count() })).toMatchObject({ total: { $count: {} } });
  });

  // Match
  const { match, gt, gte, lt, lte, after, before } = stages.match;

  test('one filter', () => {
    expect(match({ id: 42 })).toMatchObject({ $match: { id: 42 } });
    expect(match({ name: 'Sander' })).toMatchObject({ $match: { name: 'Sander' } });
  });

  test('multiple filters', () => {
    expect(match({ id: 42, name: 'Sander' })).toMatchObject({ $match: { id: 42, name: 'Sander' } });
  });

  test('gt', () => {
    expect(match({ id: gt(42) })).toMatchObject({ $match: { id: { $gt: 42 } } });
  });

  test('gte', () => {
    expect(match({ id: gte(42) })).toMatchObject({ $match: { id: { $gte: 42 } } });
  });

  test('lt', () => {
    expect(match({ id: lt(42) })).toMatchObject({ $match: { id: { $lt: 42 } } });
  });

  test('lte', () => {
    expect(match({ id: lte(42) })).toMatchObject({ $match: { id: { $lte: 42 } } });
  });

  test('after', () => {
    expect(match({ 'deleted.when': after('2021-06-24T00:00:00.000Z') })).toMatchObject({
      $match: { 'deleted.when': { $gte: fits.type(Date) } },
    });
  });

  test('before', () => {
    expect(match({ 'deleted.when': before('2021-06-24T00:00:00.000Z') })).toMatchObject({
      $match: { 'deleted.when': { $lt: fits.type(Date) } },
    });
  });

  // Sort
  const { sort, asc, desc } = stages.sort;

  test('sort', () => {
    expect(sort({})).toBeUndefined();
    expect(sort({ name: -1 })).toMatchObject({ $sort: { name: -1 } });
    expect(sort({ name: 1, email: -1 })).toMatchObject({ $sort: { name: 1, email: -1 } });
  });

  test('asc', () => {
    expect(asc('name')).toMatchObject({ $sort: { name: 1 } });
  });

  test('desc', () => {
    expect(desc('name')).toMatchObject({ $sort: { name: -1 } });
  });

  // Group
  const { group, count, avg, sum, first, last, min, max, date } = stages.group;

  test('count', () => {
    expect(decode.fields({ total: count() })).toMatchObject({ total: { $count: {} } });
  });

  test('avg', () => {
    expect(decode.fields({ total: avg('level') })).toMatchObject({ total: { $avg: '$level' } });
  });

  test('sum', () => {
    expect(decode.fields({ total: sum('price') })).toMatchObject({ total: { $sum: '$price' } });
  });

  test('first', () => {
    expect(decode.fields({ total: first('item') })).toMatchObject({ total: { $first: '$item' } });
  });

  test('last', () => {
    expect(decode.fields({ total: last('item') })).toMatchObject({ total: { $last: '$item' } });
  });

  test('min', () => {
    expect(decode.fields({ total: min('item') })).toMatchObject({ total: { $min: '$item' } });
  });

  test('max', () => {
    expect(decode.fields({ total: max('item') })).toMatchObject({ total: { $max: '$item' } });
  });

  test('groupBy string id and single field', () => {
    const g = group({ total: sum('count') }).by('brandId');
    expect(g).toMatchObject({ $group: { _id: 'brandId', total: { $sum: '$count' } } });
  });

  test('groupBy string id and multiple fields', () => {
    const g = group({ total: sum('count'), count: count() }).by('brandId');
    expect(g).toMatchObject({ $group: { _id: 'brandId', total: { $sum: '$count' }, count: { $count: {} } } });
  });

  test('groupBy filter id and single field', () => {
    const g = group({ count: count() }).by({ 'created.when': date() });
    expect(g).toMatchObject({
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
    expect(skip({})).toBeUndefined();
    expect(skip(options)).toMatchObject({ $skip: options.skip });
  });

  test('take', () => {
    expect(take({})).toBeUndefined();
    expect(take(options)).toMatchObject({ $limit: options.take });
  });

  // Search
  const { auto, search } = stages.search;

  test('auto', () => {
    expect(search({ name: auto('42') })).toMatchObject({
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
    expect(set({ score: score(), name: 'Sander' })).toMatchObject({
      $set: {
        score: { $meta: 'searchScore' },
        name: 'Sander',
      },
    });
  });
});
