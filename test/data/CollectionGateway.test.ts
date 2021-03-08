import { CollectionGateway, Json, List, resolve, toJson } from '../../src';
import { Dev } from '../ref';

describe('CollectionGateway', () => {
  const dev = Dev.All.first();
  let gateway: CollectionGateway;

  beforeEach(() => {
    gateway = new CollectionGateway('devs', resolve(Dev.All.toJSON()));
  });

  test('byId with known id returns product', () => {
    return expect(gateway.byId(dev.id)).resolves.toStrictEqual(dev.toJSON());
  });

  test('byId with unknown id returns undefined', () => {
    return expect(gateway.byId(0)).resolves.toBeUndefined();
  });

  test('byId returns a copy', async () => {
    const a = await gateway.byId(dev.id);
    a.name = 'Hello';
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
    expect([...a]).toStrictEqual([...Dev.All.toJSON()]);
  });

  test('all returns a copy of all devs', async () => {
    const a: List<Json> = await gateway.all();
    a.first().name = 'Hello';
    expect(a).not.toStrictEqual(toJson(Dev.All));
  });

  test('exists is false on non-existing dev', async () => {
    return expect(gateway.exists(Dev.Invalid.id)).resolves.toBeFalsy();
  });

  test('exists is true on a existing dev', async () => {
    return expect(gateway.exists(dev.id)).resolves.toBeTruthy();
  });
});
