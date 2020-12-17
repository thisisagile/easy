import { Dev } from './Dev';
import { reject, Repo, resolve } from '../../src';
import { DevGateway } from './DevGateway';

export class DevRepo extends Repo<Dev> {
  constructor(readonly devs = new DevGateway()) {
    super(Dev, devs);
  }

  validate = (dev: Dev): Promise<Dev> => (dev.name.includes('e') ? resolve(dev) : reject("Name should include 'e'."));
}
