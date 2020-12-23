import { MappedRouteGateway, RestResult, RouteGateway } from '../../src';
import { DevUri } from './DevUri';

export class DevGateway extends RouteGateway {
  readonly route = DevUri.Developers;
  readonly routeId = DevUri.Developer;

  byName = (): Promise<RestResult> => this.api.get(DevUri.Developers, r => r.payload);
}

export class MappedDevGateway extends MappedRouteGateway {
  readonly route = DevUri.Developers;
  readonly routeId = DevUri.Developer;
}
