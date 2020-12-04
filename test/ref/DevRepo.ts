import { Dev } from './Dev';
import { Repo } from '../../src/domain/Repo';
import { DevGateway } from './DevGateway';

export class DevRepo extends Repo<Dev> {
  constructor(readonly devs = new DevGateway()) {super(Dev, devs); }
}
