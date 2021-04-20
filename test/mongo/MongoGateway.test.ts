import { fits, mock } from '@thisisagile/easy-test';
import { devData } from '../ref';
import { MongoGateway, MongoProvider } from '../../src';
import { DevCollection } from '../ref/DevCollection';

describe('MongoGateway', () => {
  let provider!: MongoProvider;
  let gateway!: MongoGateway;

  beforeEach(() => {
    provider = mock.empty<MongoProvider>();
    gateway = new MongoGateway(new DevCollection(), provider);
  });

  test('All calls the provider', async () => {
    provider.all = mock.resolve(devData);
    await expect(gateway.all()).resolves.toBe(devData);
    expect(provider.all).toHaveBeenCalled();
  });

  test('byId calls the provider', async () => {
    provider.byId = mock.resolve(devData.naoufal);
    await expect(gateway.byId(42)).resolves.toBe(devData.naoufal);
    expect(provider.byId).toHaveBeenCalledWith(42);
  });

  test('by calls the provider', async () => {
    provider.by = mock.resolve(devData.naoufal);
    await expect(gateway.by('id', 42)).resolves.toBe(devData.naoufal);
    expect(provider.by).toHaveBeenCalledWith('id', 42);
  });

  test('find calls provider', async () => {
    provider.find = mock.resolve(devData);
    await expect(gateway.find({ id: { $eq: 42 } })).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ id: { $eq: 42 } }));
  });

  test('find calls provider with a collection', async () => {
    const devs = new DevCollection();
    provider.find = mock.resolve(devData);
    await expect(gateway.find(devs.name.is('Naoufal'))).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ Name: { $eq: 'Naoufal' } }));
  });

  test('google calls provider with a collection', async () => {
    const devs = new DevCollection();
    provider.find = mock.resolve(devData);
    await expect(gateway.find(devs.google('Naoufal'))).resolves.toBe(devData);
    expect(provider.find).toHaveBeenCalledWith(fits.with({ $text: { $search: 'Naoufal' } }));
  });

  test('google search calls provider with a collection', async () => {
    provider.find = mock.resolve(devData);
    await expect(gateway.search('Naoufal')).resolves.toBe(devData);
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
    provider.add = mock.resolve(devData.naoufal);
    await expect(gateway.add(devData.wouter)).resolves.toBe(devData.naoufal);
    expect(provider.add).toHaveBeenCalled();
  });

  test('remove calls the provider', async () => {
    provider.remove = mock.resolve(true);
    await gateway.remove(42);
    expect(provider.remove).toHaveBeenCalled();
  });

  test('update calls the provider', async () => {
    provider.update = mock.resolve(devData.jeroen);
    await expect(gateway.update(devData.jeroen)).resolves.toBe(devData.jeroen);
    expect(provider.update).toHaveBeenCalled();
  });
});
