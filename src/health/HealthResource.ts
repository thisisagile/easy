import { get, Resource, route } from '../services';
import { resolve } from '../utils';
import { HealthUri } from './HealthUri';
import { Result, toResult } from '../types';

@route(HealthUri.Health)
export class HealthResource implements Resource {
  @get()
  ok = (): Promise<Result> => resolve(toResult('Endpoint is healthy'));
}
