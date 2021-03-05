import { mongo, MongoQuery } from '../../src/mongo';

describe('MongoQuery', () => {
  test('new query', () => {
    expect(mongo('query')).toBeInstanceOf(MongoQuery);
    expect(mongo('q').query).toBe('q');
  });
});
