import { resolve, Json } from '@thisisagile/easy';
import { HealthUri } from './HealthUri';
import { Resource, route } from '../resources';
import { get } from '../http';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Json> => resolve({ state: 'Service is healthy.' });
}
