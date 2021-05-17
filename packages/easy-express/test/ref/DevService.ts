import { Handler, Service } from '@thisisagile/easy';
import { error, notFound } from '../../src';

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}
