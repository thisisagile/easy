import { CollectionGateway, List, toJson } from '../../src';
import { Dev, DevCollectionGateway } from '../ref';
import { Json } from '@thisisagile/easy-test/dist/utils/Types';

describe('CollectionGateway', () => {
  let gateway: DevCollectionGateway;

  beforeEach(() => {
    gateway = new DevCollectionGateway();
  });

  test('Given product with id exists when getting product by id then return product', async () => {
    await expect(gateway.byId(Dev.All.first().id)).resolves.toStrictEqual(Dev.All.first().toJSON());
  });

  test('Given unknown id when getting product by id then no product is returned', async () => {
    await expect(gateway.byId('???')).resolves.toBeUndefined();
  });

  test('Given product when getting product by id then returned product is copy', async () => {
    const a: any = await gateway.byId(Dev.All.first().id);
    a.name = 'Hello';
    expect(a).not.toStrictEqual(Dev.All.first().toJSON());
  });

  test('When getting all products then all products are returned', async () => {
    const a: List<Json> = await gateway.all();
    expect([...a]).toStrictEqual([...Dev.All.toJSON()]);
  });

  test('When getting all products then returned products are copy', async () => {
    const a: List<Json> = await gateway.all();
    a.first().name = 'Hello';
    expect(a).not.toStrictEqual(toJson(Dev.All));
  });
});
