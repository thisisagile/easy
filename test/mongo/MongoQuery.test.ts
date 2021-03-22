import { mongo, MongoQuery } from '../../src';

describe('MongoQuery', () => {
  test('new query', () => {
    expect(mongo('query')).toBeInstanceOf(MongoQuery);
    expect(mongo('q').query).toBe('q');
  });
});
