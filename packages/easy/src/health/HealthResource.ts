import { resolve } from '../utils';
import { HealthUri } from './HealthUri';
import { Json } from '../types';
import { get, Resource, route } from '../resources';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Json> => resolve({ state: 'Service is healthy.' });
}
