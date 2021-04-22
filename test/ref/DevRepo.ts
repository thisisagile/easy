import { Dev } from './Dev';
import { reject, Repo, resolve, RouteGateway } from '../../src';
import { DevUri } from './DevUri';

export class DevRepo extends Repo<Dev> {
  constructor(
    readonly devs = new RouteGateway(
      () => DevUri.Developers,
      () => DevUri.Developer
    )
  ) {
    super(Dev, devs);
  }

  validate = (dev: Dev): Promise<Dev> => (dev.name.includes('e') ? resolve(dev) : reject("Name should include 'e'."));
}
