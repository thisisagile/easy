import { CollectionGateway, resolve } from '../../src';
import { Dev } from './Dev';

export class DevCollectionGateway extends CollectionGateway {
  constructor() {
    super('developers', resolve(Dev.All.toJSON()));
  }
}
