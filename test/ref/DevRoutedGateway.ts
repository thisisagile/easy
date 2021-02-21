import { MappedRouteGateway, RouteGateway } from '../../src';
import { DevUri } from './DevUri';

export class DevRoutedGateway extends RouteGateway {
  readonly route = DevUri.Developers;
  readonly routeId = DevUri.Developer;
}

export class MappedDevGateway extends MappedRouteGateway {
  readonly route = DevUri.Developers;
  readonly routeId = DevUri.Developer;
}
