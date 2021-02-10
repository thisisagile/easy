import { get, Resource } from '../services';
import { resolve } from '../utils';

export class HealthResource implements Resource {
  @get()
  ok = (): Promise<string> => resolve('Endpoint is healthy');
}
