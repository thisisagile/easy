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
  const { match, filter, gt, gte, lt, lte, isIn, notIn, after, before, anywhere } = stages.match;

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
    expect(match({ name: anywhere('sander') })).toStrictEqual({
      $match: {
        name: {
          $regex: 'sander',
          $options: 'i',
        },
      },
    });
    expect(match({ name: anywhere('sa/n&d(er') })).toStrictEqual({
      $match: {
        name: {
          $regex: 'sa/n&d\\(er',
          $options: 'i',
        },
      },
    });
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

  test('isIn', () => {
    expect(match({ classicId: isIn([3, 4]) })).toStrictEqual({
      $match: { classicId: { $in: [3, 4] } },
    });
  });

  test('isIn from string', () => {
    expect(match({ classicId: isIn('3,4') })).toStrictEqual({
      $match: { classicId: { $in: ['3', '4'] } },
    });
  });

  test('notIn', () => {
    expect(match({ classicId: notIn([3, 4]) })).toStrictEqual({
      $match: { classicId: { $nin: [3, 4] } },
    });
  });

  test('notIn from string', () => {
    expect(match({ classicId: notIn('3,4') })).toStrictEqual({
      $match: { classicId: { $nin: ['3', '4'] } },
    });
  });

  type TestFilter = { ids?: string; q?: string };

  // Match filter
  const filters = filter<TestFilter>({
    ids: v => ({ id: isIn(v) }),
    q: (v: any) => ({ $text: { $search: v } }),
  });

  test('match filter', () => {
    expect(filters.from({ ids: '43,44', q: 'sander' })).toStrictEqual({
      $match: {
        id: { $in: ['43', '44'] },
        $text: { $search: 'sander' },
      },
    });
  });

  // Sort
  const { sort, sorter, asc, desc } = stages.sort;

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

  test('sorter', () => {
    const s = sorter({ 'name-asc': { name: 1 }, 'name-desc': { name: -1 } });
    expect(s.from()).toBeUndefined();
    expect(s.from({ s: 'no-asc' })).toBeUndefined();
    expect(s.from({ s: 'no-asc' }, 'no-asc2')).toBeUndefined();
    expect(s.from({ s: 'no-asc' }, 'name-desc')).toStrictEqual({ $sort: { name: -1 } });
    expect(s.from({ s: 'name-asc' })).toStrictEqual({ $sort: { name: 1 } });
    expect(s.from({ s: 'name-asc' }, 'name-desc')).toStrictEqual({ $sort: { name: 1 } });
    expect(s.keys).toStrictEqual(['name-asc', 'name-desc']);
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
    expect(decode.fields({ count: sum() })).toStrictEqual({ count: { $sum: 1 } });
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

  test('groupBy id and push specific field', () => {
    const g = group({ prop: first('props'), values: push('props.values') }).by('props.id');
    expect(g).toStrictEqual({
      $group: {
        _id: '$props.id',
        prop: {
          $first: '$props',
        },
        values: {
          $push: '$props.values',
        },
      },
    });
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
  const { auto, fuzzy, search } = stages.search;

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

  test('fuzzy', () => {
    expect(search({ name: fuzzy('42') })).toStrictEqual({
      $search: {
        text: {
          query: '42',
          path: 'name',
          fuzzy: {
            maxEdits: 1,
          },
        },
      },
    });
  });

  test('fuzzy with undefined', () => {
    expect(search({ name: fuzzy(undefined) })).toBeUndefined();
  });

  test('fuzzy with wildcard', () => {
    expect(search({ wildcard: fuzzy('42', 2) })).toStrictEqual({
      $search: {
        text: {
          query: '42',
          path: { wildcard: '*' },
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });
  });

  test('fuzzy with wildcard and undefined', () => {
    expect(search({ wildcard: fuzzy(undefined, 2) })).toBeUndefined();
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
  const { include, exclude, includes, project } = stages.project;

  test('projection include', () => {
    expect(include()).toBeUndefined();
    expect(include({})).toStrictEqual({ $project: {} });
    expect(include('content', { color: 1 })).toStrictEqual({ $project: { content: 1, color: 1 } });
    expect(include('content', { name: '$name', color: 1 })).toStrictEqual({
      $project: {
        content: 1,
        name: '$name',
        color: 1,
      },
    });
  });

  test('includes', () => {
    const i = includes({ basic: ['name', 'description'], extended: ['name', 'description', 'specs'] });
    expect(i.from()).toBeUndefined();
    expect(i.from({ i: 'unknown' })).toBeUndefined();
    expect(i.from({ i: 'unknown' }, 'unknown2')).toBeUndefined();
    expect(i.from({ i: 'unknown' }, 'extended')).toStrictEqual({ $project: { name: 1, description: 1, specs: 1 } });
    expect(i.from({ i: 'basic' })).toStrictEqual({ $project: { name: 1, description: 1 } });
    expect(i.from({ i: 'basic' }, 'extended')).toStrictEqual({ $project: { name: 1, description: 1 } });
    expect(i.keys).toStrictEqual(['basic', 'extended']);
  });

  test('projection exclude', () => {
    expect(exclude()).toBeUndefined();
    expect(exclude({})).toStrictEqual({ $project: {} });
    expect(exclude('content', { color: 0 })).toStrictEqual({ $project: { content: 0, color: 0 } });
  });

  test('project', () => {
    expect(project()).toBeUndefined();
    expect(project({})).toStrictEqual({ $project: {} });
    expect(project({ name: 1, color: 1 })).toStrictEqual({ $project: { name: 1, color: 1 } });
  });

  // ReplaceWith

  const { merge, rootAnd, currentAnd, replaceWith } = stages.replaceWith;

  test('merge', () => {
    expect(replaceWith(merge())).toBeUndefined();
    expect(replaceWith(merge({}))).toStrictEqual({ $replaceWith: { $mergeObjects: [{}] } });
    expect(replaceWith(merge('$$ROOT', '$contents.nl', { taxonomy: '$taxonomy.nl' }))).toStrictEqual({
      $replaceWith: { $mergeObjects: ['$$ROOT', '$contents.nl', { taxonomy: '$taxonomy.nl' }] },
    });
  });

  test('mergeToRoot', () => {
    expect(replaceWith(rootAnd())).toStrictEqual({ $replaceWith: { $mergeObjects: ['$$ROOT'] } });
    expect(replaceWith(rootAnd({}))).toStrictEqual({ $replaceWith: { $mergeObjects: ['$$ROOT', {}] } });
    expect(replaceWith(rootAnd('$contents.be', { taxonomy: '$taxonomy.be' }))).toStrictEqual({
      $replaceWith: { $mergeObjects: ['$$ROOT', '$contents.be', { taxonomy: '$taxonomy.be' }] },
    });
  });

  test('mergeToCurrent', () => {
    expect(replaceWith(currentAnd())).toStrictEqual({ $replaceWith: { $mergeObjects: ['$$CURRENT'] } });
    expect(replaceWith(currentAnd({}))).toStrictEqual({ $replaceWith: { $mergeObjects: ['$$CURRENT', {}] } });
    expect(replaceWith(currentAnd('$contents.de', { taxonomy: '$taxonomy.de' }))).toStrictEqual({
      $replaceWith: { $mergeObjects: ['$$CURRENT', '$contents.de', { taxonomy: '$taxonomy.de' }] },
    });
  });

  // Facet

  const { data, facet, count: cnt, unwind } = stages.facet;

  test('clauses', () => {
    expect(cnt('brands')()).toStrictEqual({ $sortByCount: '$brands' });
    expect(cnt()('brands')).toStrictEqual({ $sortByCount: '$brands' });
    expect(cnt('categories')('brands')).toStrictEqual({ $sortByCount: '$categories' });
    expect(unwind('brands')()).toStrictEqual({ $unwind: '$brands' });
    expect(unwind()('brands')).toStrictEqual({ $unwind: '$brands' });
    expect(unwind('categories')('brands')).toStrictEqual({ $unwind: '$categories' });
  });

  test('facet', () => {
    expect(facet({ data: data() })).toStrictEqual({ $facet: { data: [] } });
    expect(facet({ brands: unwind() })).toStrictEqual({ $facet: { brands: [{ $unwind: '$brands' }] } });
    expect(facet({ brands: cnt() })).toStrictEqual({ $facet: { brands: [{ $sortByCount: '$brands' }] } });
    expect(facet({ brands: [unwind(), cnt()] })).toStrictEqual({ $facet: { brands: [{ $unwind: '$brands' }, { $sortByCount: '$brands' }] } });
    expect(facet({ props: [unwind(), group({ prop: first('props') }).by('props.id')] })).toStrictEqual({
      $facet: { props: [{ $unwind: '$props' }, { $group: { _id: '$props.id', prop: { $first: '$props' } } }] },
    });
  });

  test('straight unwind', () => {
    expect(stages.unwind.unwind('brands')).toStrictEqual({ $unwind: '$brands' });
  });
});
