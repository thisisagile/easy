import { error, Handler, notFound, Service } from '../../src';

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}
