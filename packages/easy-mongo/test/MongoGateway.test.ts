import { fits, mock } from '@thisisagile/easy-test';
import { MongoGateway, MongoProvider } from '../src';
import { collData, DevCollection, devData } from './ref/DevCollection';
import { toList, toPageList } from '@thisisagile/easy';

describe('MongoGateway', () => {
  let provider!: MongoProvider;
  let gateway!: MongoGateway;
  const all = [devData.naoufal, devData.wouter, devData.jeroen, devData.sander];
  const allColl = toList([collData.naoufal, collData.wouter, collData.jeroen, collData.sander]);
  const devCollection = new DevCollection();

  beforeEach(() => {
    provider = mock.empty<MongoProvider>();
    gateway = new MongoGateway(devCollection, provider);
  });

  test('Gateway uses provider from collection if none supplied', () => {
    const p = jest.spyOn(devCollection, 'provider', 'get');
    p.mockReturnValue(provider);
    new MongoGateway(devCollection);
    expect(p).toHaveBeenCalled();
  });

  test('All calls the provider', async () => {
    provider.all = mock.resolve(toPageList(all));
    await expect(gateway.all()).resolves.toMatchJson(toPageList(allColl));
    expect(provider.all).toHaveBeenCalled();
  });

  test('All returns PagedList', async () => {
    provider.all = mock.resolve(toPageList(all, { total: 100 }));
    const res = await gateway.all();
    expect(res.total).toBe(100);
  });

  test('byId calls the provider', async () => {
    provider.byId = mock.resolve(devData.naoufal);
    await expect(gateway.byId(42)).resolves.toStrictEqual(collData.naoufal);
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('byIds calls the provider', async () => {
    provider.find = mock.resolve(toPageList(all));
    await expect(gateway.byIds(56, 54)).resolves.toMatchJson(toPageList(allColl));
    expect(provider.find).toHaveBeenCalledWith(fits.with({ Id: { $in: [56, 54] } }), undefined);
  });

  test('byId returns undefined when provider returns undefined', async () => {
    provider.byId = mock.resolve(undefined);
    await expect(gateway.byId(42)).resolves.toBeUndefined();
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('by calls the provider', async () => {
    provider.by = mock.resolve(toPageList([devData.naoufal]));
    await expect(gateway.by('id', 42)).resolves.toMatchJson(toPageList([collData.naoufal]));
    expect(provider.by).toHaveBeenCalledWith('id', 42, undefined);
  });

  test('find calls provider', async () => {
    provider.find = mock.resolve(toPageList(all));
    await expect(gateway.find({ id: { $eq: 42 } })).resolves.toMatchJson(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ id: { $eq: 42 } }), undefined);
  });

  test('find calls provider with a collection', async () => {
    provider.find = mock.resolve(toPageList(all));
    await expect(gateway.find(devCollection.name.is('Naoufal'))).resolves.toMatchJson(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ Name: { $eq: 'Naoufal' } }), undefined);
  });

  test('google calls provider with a collection', async () => {
    provider.find = mock.resolve(toPageList(all));
    await expect(gateway.find(devCollection.google('Naoufal'))).resolves.toMatchJson(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ $text: { $search: 'Naoufal' } }), undefined);
  });

  test('google search calls provider with a collection', async () => {
    provider.find = mock.resolve(toPageList([devData.naoufal]));
    await expect(gateway.search('Naoufal')).resolves.toMatchJson(toPageList([collData.naoufal]));
    expect(provider.find).toHaveBeenCalledWith(fits.with({ $text: { $search: 'Naoufal' } }), undefined);
  });

  test('exists resolves to true on existing item', async () => {
    provider.byId = mock.resolve(devData.naoufal);
    await expect(gateway.exists(42)).resolves.toBeTruthy();
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('exists resolves to false on non existing item', async () => {
    provider.byId = mock.resolve();
    await expect(gateway.exists(42)).resolves.toBeFalsy();
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('aggregate resolves and removes empty filters', async () => {
    provider.aggregate = mock.resolve();
    await gateway.aggregate({}, undefined, { $skip: 0 });
    expect(provider.aggregate).toHaveBeenCalledWith([{ $skip: 0 }]);
  });

  test('aggregate resolves and removes empty filters, test two', async () => {
    provider.aggregate = mock.resolve();
    await gateway.aggregate({}, { $match: { id: 4 } }, { $skip: 0 });
    expect(provider.aggregate).toHaveBeenCalledWith([{ $match: { id: 4 } }, { $skip: 0 }]);
  });

  test('match resolves', async () => {
    provider.aggregate = mock.resolve();
    await gateway.match({ id: 4 });
    expect(provider.aggregate).toHaveBeenCalledWith([{ $match: { id: 4 } }]);
  });

  test('aggregate resolves and removes empty filters, now with an array', async () => {
    provider.aggregate = mock.resolve();
    await gateway.aggregate([{}, { $match: { id: 4 } }, { $skip: 0 }]);
    expect(provider.aggregate).toHaveBeenCalledWith([{ $match: { id: 4 } }, { $skip: 0 }]);
  });

  test('add calls the provider', async () => {
    provider.add = mock.resolve(devData.wouter);
    await expect(gateway.add(collData.wouter)).resolves.toStrictEqual(collData.wouter);
    expect(provider.add).toHaveBeenCalledWith(devData.wouter);
  });

  test('remove calls the provider', async () => {
    provider.remove = mock.resolve(true);
    await gateway.remove(42);
    expect(provider.remove).toHaveBeenCalled();
  });

  test('update calls the provider', async () => {
    provider.update = mock.resolve(devData.jeroen);
    await expect(gateway.update(collData.jeroen)).resolves.toStrictEqual(collData.jeroen);
    expect(provider.update).toHaveBeenCalledWith({ ...devData.jeroen, Language: 'TypeScript' });
  });
});
