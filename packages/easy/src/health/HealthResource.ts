import { HealthUri } from './HealthUri';
import { route } from '../resources/Route';
import { Resource } from '../resources/Resource';
import { get } from '../http/Verb';
import { Json } from '../types/Json';
import { resolve } from '../utils/Promise';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Json> => resolve({ state: 'Service is healthy.' });
}
