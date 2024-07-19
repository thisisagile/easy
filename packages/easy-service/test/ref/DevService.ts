import { Handler, Service } from '../../src';

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [];
}
