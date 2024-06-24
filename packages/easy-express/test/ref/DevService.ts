import { error, notFound } from '../../src';
import { Handler, Service } from '@thisisagile/easy-service';

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}
