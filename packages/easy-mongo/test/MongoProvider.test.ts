import { AbstractCursor, Collection, Db, MongoClient } from 'mongodb';
import { MongoProvider } from '../src';
import { fits, mock } from '@thisisagile/easy-test';
import { Dev, devData } from '@thisisagile/easy/test/ref';
import { DevCollection } from './ref/DevCollection';
import { DateTime, Exception, toCondition } from '@thisisagile/easy';

describe('MongoProvider', () => {
  let client: MongoClient;
  let db: Db;
  const c = {} as Collection;
  const cursor = mock.a<AbstractCursor>({ toArray: mock.return([]) });
  let provider: MongoProvider;
  const devs = new DevCollection();
  const filter = { name: { $exists: true } };
  const date = '2023-09-22T12:30:00.000+00:00';

  beforeEach(() => {
    client = mock.empty<MongoClient>({ connect: mock.impl(() => client) });
    db = mock.empty<Db>();
    db.collection = mock.resolve({ collectionName: 'devCollection' });
    client.db = mock.resolve(db);
    provider = new MongoProvider(devs, Promise.resolve(client));
  });

  test('all calls find', async () => {
    provider.find = mock.resolve(devData);
    await expect(provider.all()).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith({}, undefined);
  });

  test('all calls find with options', async () => {
    provider.find = mock.resolve(devData);
    const options = { limit: 300, skip: 4 };
    await expect(provider.all(options)).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith({}, options);
  });

  test('byId calls findOne on the collection', async () => {
    const findOne = mock.resolve(devData.jeroen);
    provider.collection = mock.resolve({ findOne });
    await expect(provider.byId('42')).resolves.toStrictEqual(devData.jeroen);
    return expect(findOne).toHaveBeenCalledWith({ id: '42' });
  });

  test('mongoIds are removed from the found items', () => {
    const devJeroen = { ...devData.jeroen, _id: 42 };
    provider.collection = mock.resolve({ findOne: mock.resolve(devJeroen) });
    return expect(provider.byId(42)).resolves.toStrictEqual(devData.jeroen);
  });

  test('find calls find on the collection', async () => {
    cursor.toArray = mock.resolve([devData.jeroen, devData.wouter]);
    c.find = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    const res = await provider.find([{ id: '42' }]);
    expect(res.last()).toMatchObject(devData.wouter);
  });

  test('find with undefined calls find on the collection with default options', async () => {
    cursor.toArray = mock.resolve([]);
    c.find = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    await provider.find({});
    expect(c.find).toHaveBeenCalledWith({}, { limit: 250, sort: {} });
  });

  test('find with with only skip keeps limit', async () => {
    cursor.toArray = mock.resolve([]);
    c.find = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    await provider.find({}, { skip: 3 });
    expect(c.find).toHaveBeenCalledWith({}, fits.json({ skip: 3, limit: 250 }));
  });

  test('find calls toMongoType on queries, to correct dates', async () => {
    provider.collection = mock.resolve(c);
    cursor.toArray = mock.resolve([]);
    c.find = mock.resolve(cursor);

    await provider.find({ date: date });

    expect(c.find).toHaveBeenCalledWith({ date: new DateTime(date).toDate() }, expect.anything());
    expect(c.find).not.toHaveBeenCalledWith({ date: date }, expect.anything());
  });

  test('find with sort options', async () => {
    c.find = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    await provider.find(devs.where(devs.name.is('Jeroen')), { take: 2, sort: [devs.name.desc(), devs.language.asc()] });
    expect(c.find).toHaveBeenCalledWith({ $and: [{ Name: { $eq: 'Jeroen' } }] }, { limit: 2, sort: { Name: 1, Language: -1 } });
  });

  test('group calls aggregate on the collection', () => {
    cursor.toArray = mock.resolve([devData.jeroen, devData.wouter, devData.naoufal]);
    c.aggregate = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    return expect(provider.group([{ id: '42' }])).resolves.toHaveLength(3);
  });

  test('group calls toMongoType on queries, to correct dates', async () => {
    provider.collection = mock.resolve(c);
    cursor.toArray = mock.resolve([]);
    c.aggregate = mock.resolve(cursor);

    await provider.group([{ date: date }]);

    expect(c.aggregate).toHaveBeenCalledWith([{ date: new DateTime(date).toDate() }]);
    expect(c.aggregate).not.toHaveBeenCalledWith([{ date: date }]);
  });

  test('by calls find on the collection', async () => {
    cursor.toArray = mock.resolve([devData.jeroen, devData.wouter]);
    c.find = mock.resolve(cursor);
    provider.collection = mock.resolve(c);
    const res = await provider.by('level', 1);
    expect(res.last()).toMatchObject(devData.wouter);
    expect(c.find).toHaveBeenCalledWith({ level: '1' }, expect.anything());
  });

  test('add calls insertOne on the collection', async () => {
    c.insertOne = mock.resolve({ ops: [devData.jeroen] });
    provider.collection = mock.resolve(c);
    await expect(provider.add(devData.jeroen)).resolves.toStrictEqual(devData.jeroen);
    expect(c.insertOne).toHaveBeenCalledWith(devData.jeroen);
  });

  test('update calls updateOne on the collection and the byId to return the modified item', async () => {
    c.updateOne = mock.resolve();
    provider.collection = mock.resolve(c);
    provider.byId = mock.resolve(Dev.Jeroen.toJSON());
    await expect(provider.update(Dev.Jeroen.toJSON())).resolves.toStrictEqual(Dev.Jeroen.toJSON());
    expect(c.updateOne).toHaveBeenCalledWith({ id: Dev.Jeroen.id }, { $set: Dev.Jeroen.toJSON() });
  });

  test('toMongoJson', () => {
    const q = { Id: { $eq: 42 } };
    expect(provider.toMongoJson(q)).toEqual(q);
    expect(provider.toMongoJson(toCondition('Id', 'eq', 42))).toEqual(q);
    expect(provider.toMongoJson(devs.id.is(42).and(devs.name.is('sander')))).toEqual({ $and: [q, { Name: { $eq: 'sander' } }] });
  });

  test('remove calls deleteOne on the collection', async () => {
    c.deleteOne = mock.resolve({ acknowledged: true });
    provider.collection = mock.resolve(c);
    await expect(provider.remove(42)).resolves.toBeTruthy();
    expect(c.deleteOne).toHaveBeenCalledWith({ id: 42 });
  });

  test('remove calls deleteOne on the collection with id as string', async () => {
    c.deleteOne = mock.resolve({ acknowledged: true });
    provider.collection = mock.resolve(c);
    await expect(provider.remove('42')).resolves.toBeTruthy();
    expect(c.deleteOne).toHaveBeenCalledWith({ id: '42' });
  });

  test('remove calls deleteOne and rejects when deleteOne does not acknowledges', async () => {
    c.deleteOne = mock.resolve({ acknowledged: false });
    provider.collection = mock.resolve(c);
    await expect(provider.remove('42')).resolves.toBeFalsy();
    expect(c.deleteOne).toHaveBeenCalledWith({ id: '42' });
  });

  test('count calls countDocuments on the collection', async () => {
    c.countDocuments = mock.resolve(42);
    provider.collection = mock.resolve(c);
    await expect(provider.count()).resolves.toBe(42);
    expect(c.countDocuments).toHaveBeenCalled();
  });

  test('count calls toMongoType on queries, to correct dates', async () => {
    provider.collection = mock.resolve(c);
    cursor.toArray = mock.resolve([]);
    c.countDocuments = mock.resolve(cursor);

    await provider.count({ date: date });

    expect(c.countDocuments).toHaveBeenCalledWith({ date: new DateTime(date).toDate() });
    expect(c.countDocuments).not.toHaveBeenCalledWith({ date: date });
  });

  test('createIndex calls createIndex on the collection and creates unique indexes by default', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createIndex('name')).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', { unique: true, writeConcern: { w: 1 } });
  });

  test('create non unique index calls createIndex on the collection', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createIndex('name', false)).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', { unique: false, writeConcern: { w: 1 } });
  });

  test('create text indexes on the collection', async () => {
    c.createIndex = mock.resolve('Language_text_Name_text');
    provider.collection = mock.resolve(c);
    await expect(provider.createTextIndexes(devs.language, devs.name)).resolves.toBe('Language_text_Name_text');
    expect(c.createIndex).toHaveBeenCalledWith({ Language: 'text', Name: 'text' });
  });

  test('createPartialIndex calls createIndex on the collection with filter expression and creates unique indexes by default', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createPartialIndex('name', filter)).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', {
      partialFilterExpression: filter,
      unique: true,
      writeConcern: { w: 1 },
    });
  });

  test('createPartialIndex calls createIndex on the collection with condition and creates unique indexes by default', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createPartialIndex('name', devs.name.exists(true))).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', {
      partialFilterExpression: devs.name.exists(true).toJSON(),
      unique: true,
      writeConcern: { w: 1 },
    });
  });

  test('createPartialIndex calls toMongoType on filter, to correct dates', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);

    await provider.createPartialIndex('date', { date: date });

    expect(c.createIndex).toHaveBeenCalledWith('date', {
      partialFilterExpression: { date: new DateTime(date).toDate() },
      unique: true,
      writeConcern: { w: 1 },
    });

    expect(c.createIndex).not.toHaveBeenCalledWith('date', {
      partialFilterExpression: { date: date },
      unique: true,
      writeConcern: { w: 1 },
    });
  });

  test('create non unique partial index calls createIndex on the collection with filter expression', async () => {
    c.createIndex = mock.resolve('_index');
    provider.collection = mock.resolve(c);
    await expect(provider.createPartialIndex('name', filter, false)).resolves.toBe('_index');
    expect(c.createIndex).toHaveBeenCalledWith('name', {
      partialFilterExpression: filter,
      unique: false,
      writeConcern: { w: 1 },
    });
  });

  test('first time connect to the mongo cluster', async () => {
    provider = new MongoProvider(devs);
    MongoProvider.client = mock.resolve(client);
    const coll = await provider.collection();
    expect(MongoProvider.client).toHaveBeenCalledWith(devs.db);
    expect(MongoProvider.client).toHaveBeenCalledWith(devs.db);
    expect(client.connect).toHaveBeenCalledTimes(1);
    expect(coll.collectionName).toBe('devCollection');
  });

  test('first time connect fails set client to undefined', async () => {
    provider = new MongoProvider(devs);
    MongoProvider.client = mock.reject(Exception.IsNotValid);
    await expect(provider.collection()).rejects.toBeInstanceOf(Exception);
    await expect(provider.collection()).rejects.toBeInstanceOf(Exception);
    expect(MongoProvider.client).toHaveBeenNthCalledWith(1, devs.db);
    expect(MongoProvider.client).toHaveBeenNthCalledWith(2, devs.db);
    expect(client.connect).not.toHaveBeenCalled();
  });

  // https://github.com/mongodb/node-mongodb-native/blob/3dba3ae5dbe584ff441e59c78c8b5905ebb23cd4/src/operations/connect.ts#L18
  test('connect is a no-op operation when already connected', async () => {
    MongoProvider.client = mock.resolve(client);
    await expect(provider.collection()).resolves.toBeDefined();
    await expect(provider.collection()).resolves.toBeDefined();
    expect(client.connect).toHaveBeenCalledTimes(2);
  });

  test('reject if db getter throws exception', async () => {
    jest.spyOn(devs, 'db', 'get').mockImplementation(() => {
      throw Exception.IsNotImplemented;
    });
    provider = new MongoProvider(devs);
    const db = mock.empty<Db>();
    db.collection = mock.resolve({ collectionName: 'devCollection' });
    client.db = mock.resolve(db);
    MongoProvider.client = mock.resolve(client);
    await expect(provider.collection()).rejects.toBeInstanceOf(Exception);
    expect(MongoProvider.client).not.toHaveBeenCalled();
  });
});
