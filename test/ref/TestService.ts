import { Service } from '../../src';

export class TestService extends Service {
  static readonly Dev = new TestService('dev');
}