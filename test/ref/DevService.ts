import { error, Handler, notFound, Service } from '../../src';

// export class TestService extends Service {
//   static readonly Dev = new TestService('dev');
// }

export class DevService extends Service {
  pre = (): Handler[] => [];
  post = (): Handler[] => [notFound, error];
}
