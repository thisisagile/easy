import { RouteGateway } from '../../src/services/RouteGateway';
import { DevUri } from './DevUri';
import { RestResult } from '../../src/services';

export class DevGateway extends RouteGateway {

  readonly route = DevUri.Developers;
  readonly routeId = DevUri.Developer;

  byName = (): Promise<RestResult> => this.api.get(DevUri.Developers, r => r.payload);
}
