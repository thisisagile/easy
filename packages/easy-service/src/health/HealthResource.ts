import { resolve, Json } from '@thisisagile/easy';
import { HealthUri } from './HealthUri';
import { Resource } from '../resources/Resource';
import { route } from '../resources/Route';
import { get } from '../http/Verb';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Json> => resolve({ state: 'Service is healthy.' });
}
