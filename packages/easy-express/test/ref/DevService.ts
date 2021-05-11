import { error, Handler, notFound, Service } from '@thisisagile/easy';

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}
