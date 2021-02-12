import { get, Resource, route } from '../services';
import { resolve } from '../utils';
import { HealthUri } from './HealthUri';
import { Json } from '../types';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Json> => resolve({ state: 'Service is healthy' });
}
