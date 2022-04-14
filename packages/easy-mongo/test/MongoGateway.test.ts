import { fits, mock } from '@thisisagile/easy-test';
import { MongoGateway, MongoProvider } from '../src';
import { collData, DevCollection, devData } from './ref/DevCollection';

describe('MongoGateway', () => {
  let provider!: MongoProvider;
  let gateway!: MongoGateway;
  const all = [devData.naoufal, devData.wouter, devData.jeroen, devData.sander];
  const allColl = [collData.naoufal, collData.wouter, collData.jeroen, collData.sander];
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
    provider.all = mock.resolve(all);
    await expect(gateway.all()).resolves.toStrictEqual(allColl);
    expect(provider.all).toHaveBeenCalled();
  });

  test('byId calls the provider', async () => {
    provider.byId = mock.resolve(devData.naoufal);
    await expect(gateway.byId(42)).resolves.toStrictEqual(collData.naoufal);
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('byIds calls the provider', async () => {
    provider.find = mock.resolve(all);
    await expect(gateway.byIds(56, 54)).resolves.toStrictEqual(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ Id: { $in: [56, 54] } }));
  });

  test('byId returns undefined when provider returns undefined', async () => {
    provider.byId = mock.resolve(undefined);
    await expect(gateway.byId(42)).resolves.toBeUndefined();
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('by calls the provider', async () => {
    provider.by = mock.resolve([devData.naoufal]);
    await expect(gateway.by('id', 42)).resolves.toStrictEqual([collData.naoufal]);
    expect(provider.by).toHaveBeenCalledWith('id', 42);
  });

  test('find calls provider', async () => {
    provider.find = mock.resolve(all);
    await expect(gateway.find({ id: { $eq: 42 } })).resolves.toStrictEqual(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ id: { $eq: 42 } }));
  });

  test('find calls provider with a collection', async () => {
    provider.find = mock.resolve(all);
    await expect(gateway.find(devCollection.name.is('Naoufal'))).resolves.toStrictEqual(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ Name: { $eq: 'Naoufal' } }));
  });

  test('google calls provider with a collection', async () => {
    provider.find = mock.resolve(all);
    await expect(gateway.find(devCollection.google('Naoufal'))).resolves.toStrictEqual(allColl);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ $text: { $search: 'Naoufal' } }));
  });

  test('google search calls provider with a collection', async () => {
    provider.find = mock.resolve([devData.naoufal]);
    await expect(gateway.search('Naoufal')).resolves.toStrictEqual([collData.naoufal]);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ $text: { $search: 'Naoufal' } }));
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
