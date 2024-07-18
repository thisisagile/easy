import '@thisisagile/easy-test';
import { Environment } from '../../src';

describe('Environment', () => {
  test('default construction.', () => {
    expect(Environment.Dev.id).toBe('dev');
    expect(Environment.Acc.name).toBe('Acceptance');
  });
});
