import { CollectionGateway, resolve, toList } from '../../src';
import { Dev } from './Dev';

export class DevCollectionGateway extends CollectionGateway {
  constructor() {
    super(resolve(toList(Dev.All.toJSON())));
  }
}
