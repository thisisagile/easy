import '@thisisagile/easy-test';
import { ofMessage } from '../../dist';

describe('ofMessage', () => {
  test('from string', () => {
    expect(ofMessage('Sander')).toBe('Sander');
  });
});
