import { mockTimezone } from '../src';

describe('index', () => {
  test('default timezone', () => {
    mockTimezone();
    expect(Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone).toBe('UTC');
  });
});
