import { MongoProvider } from '../../src/mongo';
import { Collection, Cursor, MongoClient } from 'mongodb';
import { mock } from '@thisisagile/easy-test';
import { Dev, devData } from '../ref';

describe('MongoProvider', () => {
  const client: MongoClient = new MongoClient('uri');
  let provider: MongoProvider;
  const c = {} as Collection;
  const cursor = {} as Cursor;

  beforeEach(() => {
    provider = new MongoProvider('developers', Promise.resolve(client));
  });

  test('all calls find', async () => {
    provider.find = mock.resolve(devData);
    await expect(provider.all()).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith(undefined, 250);
  });

  test('byId calls findOne on the collection', () => {
    provider.collection = mock.resolve({ findOne: mock.resolve(devData.jeroen) });
    return expect(provider.byId(42)).resolves.toBe(devData.jeroen);
  });

  test('mongoIds are removed from the found items', () => {
    const devJeroen = { ...devData.jeroen, _id: 42 };
    provider.collection = mock.resolve({ findOne: mock.resolve(devJeroen) });
    return expect(provider.byId(42)).resolves.toStrictEqual(devData.jeroen);
  });

  // test('find calls find on the collection', () => {
  //   cursor.toArray = mock.resolve(toArray(devData.jeroen));
  //   c.find = mock.resolve(cursor);
  //   provider.collection = mock.resolve(c);
  //   expect(provider.find([ {"id": "42"} ])).resolves.toStrictEqual(toList(devData.jeroen));
  // });

  test('group calls aggregate on the collection', () => {
    cursor.toArray = mock.resolve(devData);
    c.aggregate = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    return expect(provider.group([{ id: '42' }])).resolves.toBe(devData);
  });

  test('add calls insertOne on the collection', async () => {
    c.insertOne = mock.resolve({ ops: [devData.jeroen] });
    provider.collection = mock.resolve(c);
    await expect(provider.add(devData.jeroen)).resolves.toBe(devData.jeroen);
    expect(c.insertOne).toHaveBeenCalledWith(devData.jeroen);
  });

  test('update calls updateOne on the collection and the byId to return the modified item', async () => {
    c.updateOne = mock.resolve();
    provider.collection = mock.resolve(c);
    provider.byId = mock.resolve(Dev.Jeroen.toJSON());
    await expect(provider.update(Dev.Jeroen.toJSON())).resolves.toStrictEqual(Dev.Jeroen.toJSON());
    expect(c.updateOne).toHaveBeenCalledWith({ id: Dev.Jeroen.id }, { $set: Dev.Jeroen.toJSON() });
  });

  test('remove calls deleteOne on the collection', async () => {
    c.deleteOne = mock.resolve({ result: { ok: 1 } });
    provider.collection = mock.resolve(c);
    await expect(provider.remove(42)).resolves.toBeTruthy();
    expect(c.deleteOne).toHaveBeenCalledWith({ id: '42' });
  });

  test('createIndex calls createIndex on the collection and creates unique indexes by default', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createIndex('name')).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', { unique: true, w: 1 });
  });

  test('create non unique index calls createIndex on the collection', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createIndex('name', false)).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', { unique: false, w: 1 });
  });

  test('count calls countDocuments on the collection', async () => {
    c.countDocuments = mock.resolve(42);
    provider.collection = mock.resolve(c);
    await expect(provider.count()).resolves.toBe(42);
    expect(c.countDocuments).toHaveBeenCalled();
  });
});
