import '@thisisagile/easy-test';
import { Exception, Gateway } from '../../src';

describe('Gateway', () => {
  let gateway: Gateway;

  beforeEach(() => {
    gateway = new (class extends Gateway {})();
  });

  test('all', () => {
    return expect(gateway.all()).rejects.toBe(Exception.IsNotImplemented);
  });

  test('byId', () => {
    return expect(gateway.byId(42)).rejects.toBe(Exception.IsNotImplemented);
  });

  test('by', () => {
    return expect(gateway.by('name', 42)).rejects.toBe(Exception.IsNotImplemented);
  });

  test('byIds', () => {
    return expect(gateway.byIds(41, 42)).rejects.toBe(Exception.IsNotImplemented);
  });

  test('search', () => {
    return expect(gateway.search({ name: 41 })).rejects.toBe(Exception.IsNotImplemented);
  });

  test('exists', () => {
    return expect(gateway.exists(42)).rejects.toBe(Exception.IsNotImplemented);
  });

  test('add', () => {
    return expect(gateway.add({ name: 41 })).rejects.toBe(Exception.IsNotImplemented);
  });

  test('update', () => {
    return expect(gateway.update({ name: 41 })).rejects.toBe(Exception.IsNotImplemented);
  });

  test('remove', () => {
    return expect(gateway.remove(42)).rejects.toBe(Exception.IsNotImplemented);
  });
});
