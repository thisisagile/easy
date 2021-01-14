import { TableGateway } from '../../src';
import { DevTable } from './DevTable';

export class DevTableGateway extends TableGateway<DevTable> {
  constructor() { super(new DevTable()); }
}
