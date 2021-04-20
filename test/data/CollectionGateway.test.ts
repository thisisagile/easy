import { Exception, InMemoryGateway, Json, resolve, toJson, toList } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('CollectionGateway', () => {
  const dev = Dev.All.first();
  let gateway: InMemoryGateway;

  beforeEach(() => {
    gateway = new InMemoryGateway(resolve(toList<Json>(Dev.All.toJSON())));
  });

  test('byId with known id returns product', () => {
    return expect(gateway.byId(dev.id)).resolves.toStrictEqual(dev.toJSON());
  });

  test('byId with unknown id returns undefined', () => {
    return expect(gateway.byId(0)).resolves.toBeUndefined();
  });

  test('byId returns a copy', async () => {
    const a = await gateway.byId(dev.id);
    if (a) {
      a.name = 'Hello';
    }
    expect(a).not.toStrictEqual(dev.toJSON());
    return expect(gateway.byId(dev.id)).resolves.not.toStrictEqual(a);
  });

  test('by returns a list', async () => {
    await expect(gateway.by('name', 'Wouter')).resolves.toHaveLength(1);
    return expect(gateway.by('name', 'Laurens')).resolves.toHaveLength(0);
  });

  test('by with invalid key returns a list', () => {
    return expect(gateway.by('lastname', 'Wouter')).resolves.toHaveLength(0);
  });

  test('all returns all devs', async () => {
    const a = await gateway.all();
    expect(a.toJSON()).toStrictEqual(Dev.All.toJSON());
  });

  test('all returns a copy of all devs', async () => {
    const a = await gateway.all();
    a.first().name = 'Hello';
    expect(a).not.toStrictEqual(toJson(Dev.All));
  });

  test('exists is false on non-existing dev', async () => {
    return expect(gateway.exists(Dev.Invalid.id)).resolves.toBeFalsy();
  });

  test('exists is true on a existing dev', async () => {
    return expect(gateway.exists(dev.id)).resolves.toBeTruthy();
  });

  test('add works', async () => {
    await expect(gateway.add({ id: 42, name: 'Laurens' })).resolves.toMatchObject({ id: 42, name: 'Laurens' });
    return expect(gateway.byId(42)).resolves.toStrictEqual({ id: 42, name: 'Laurens' });
  });

  test('add without id does not work', async () => {
    return expect(gateway.add({ name: 'Laurens' })).rejects.toMatchException(Exception.IsMissingId);
  });

  test('add item that is already present does not work', () => {
    return expect(gateway.add(Dev.Naoufal.toJSON())).rejects.toMatchException(Exception.AlreadyExists);
  });

  test('update works', async () => {
    await gateway.update({ id: Dev.Jeroen.id, name: 'Laurens' });
    return expect(gateway.byId(Dev.Jeroen.id)).resolves.toMatchObject({ id: Dev.Jeroen.id, name: 'Laurens' });
  });

  test('update without id does not work', async () => {
    return expect(gateway.update({ name: 'Laurens' })).rejects.toMatchException(Exception.IsMissingId);
  });

  test('remove works', async () => {
    await expect(gateway.remove(Dev.Jeroen.id)).resolves.toBeTruthy();
    return expect(gateway.byId(Dev.Jeroen.id)).resolves.toBeUndefined();
  });

  test('remove without id doesnt do anything', () => {
    return expect(gateway.remove(0)).rejects.toMatchException(Exception.DoesNotExist);
  });
});
