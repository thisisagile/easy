import { CollectionGateway } from '../../src/data/CollectionGateway';
import { resolve, toJson } from '../../src';
import { Dev } from './Dev';

export class DevCollectionGateway extends CollectionGateway {
  constructor() {
    super("developers", resolve(Dev.All.map(d => toJson(d))));
  }
}