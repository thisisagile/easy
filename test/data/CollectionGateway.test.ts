import { CollectionGateway, Json, List, toJson } from '../../src';
import { Dev, DevCollectionGateway } from '../ref';

describe('CollectionGateway', () => {
  const dev = Dev.All.first();
  let gateway: DevCollectionGateway;

  beforeEach(() => {
    gateway = new DevCollectionGateway();
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

  test('all returns all products', async () => {
    const a = await gateway.all();
    expect([...a]).toStrictEqual([...Dev.All.toJSON()]);
  });

  test('all returns a copy of all products', async () => {
    const a: List<Json> = await gateway.all();
    a.first().name = 'Hello';
    expect(a).not.toStrictEqual(toJson(Dev.All));
  });
});
