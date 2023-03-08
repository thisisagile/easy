import '@thisisagile/easy-test';
import { aggregation } from '../src';

describe('Aggregation', () => {
  const name = { name: 'Sander' };
  const options = { skip: 10, take: 5 };
  const { id, eq, match, sum, group, skip, take, sort, asc } = aggregation;

  test('id', () => {
    expect(id(42)).toMatchObject({ $match: { id: 42 } });
  });

  test('eq', () => {
    expect(eq('name', 42)).toMatchObject({ $match: { name: 42 } });
  });

  test('match', () => {
    expect(match(name)).toMatchObject({ $match: name });
  });

  test('sum', () => {
    expect(sum('total', 'count')).toMatchObject({ total: { $sum: '$count' } });
    expect(sum('total')).toMatchObject({ total: { $sum: '$total' } });
  });

  test('group', () => {
    const g = group('brandId', sum('total', 'count'));
    expect(g).toMatchObject({ $group: { _id: 'brandId', total: { $sum: '$count' } } });
  });

  test('skip', () => {
    expect(skip({})).toBeUndefined();
    expect(skip(options)).toMatchObject({ $skip: options.skip });
  });

  test('take', () => {
    expect(take({})).toBeUndefined();
    expect(take(options)).toMatchObject({ $limit: options.take });
  });

  test('sort', () => {
    expect(sort({})).toBeUndefined();
    expect(sort({ name: 1 })).toMatchObject({ $sort: { name: 1 } });
    expect(sort({ name: 1, email: -1 })).toMatchObject({ $sort: { name: 1, email: -1 } });
  });

  test('asc', () => {
    expect(asc('name')).toMatchObject({ $sort: { name: 1 } });
  });
});
