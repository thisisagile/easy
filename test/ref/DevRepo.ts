import { Dev } from './Dev';
import { Repo } from '../../src';
import { DevGateway } from './DevGateway';

export class DevRepo extends Repo<Dev> {
  constructor(readonly devs = new DevGateway()) {super(Dev, devs); }
}
