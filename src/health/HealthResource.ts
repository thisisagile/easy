import { get, Resource, route } from '../services';
import { resolve } from '../utils';
import { HealthUri } from './HealthUri';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<string> => resolve('Endpoint is healthy');
}
