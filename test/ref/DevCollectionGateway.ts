import { InMemoryGateway, resolve, toList } from '../../src';
import { Dev } from './Dev';

export class DevCollectionGateway extends InMemoryGateway {
  constructor() {
    super(resolve(toList(Dev.All.toJSON())));
  }
}
