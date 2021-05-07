import { HealthUri } from '../../src';
import '@thisisagile/easy-test';

describe('HealthUri', () => {
  test('return route', () => {
    expect(HealthUri.Health).toMatchRoute('/health');
    expect(HealthUri.Health.route('dev')).toMatchRoute('/dev/health');
  });
});
