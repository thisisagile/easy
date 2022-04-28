import '@thisisagile/easy-test';
import { Exception, Gateway } from '../../src';

describe('Gateway', () => {

  let gateway: Gateway;

  beforeEach(() => {
    gateway = new class extends Gateway {}
  });

  test('all', () => {
    return expect(gateway.all()).rejects.toBe(Exception.IsNotImplemented);
  });

  test('byId', () => {
    return expect(gateway.byId(42)).rejects.toBe(Exception.IsNotImplemented);
  });
});
