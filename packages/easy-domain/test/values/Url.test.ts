import '@thisisagile/easy-test';
import { url } from '../../src';

describe('Url', () => {
  const valids = ['https://sander.com', 'https://www.sander.com', 'https://mail.sander.com'];
  const invalids = ['', 'https://', 'sander', '666://www.sander.42'];

  test.each(valids)('valid urls with default options', v => {
    expect(url(v)).toBeValid();
  });

  test.each(invalids)('invalid urls with default options', v => {
    expect(url(v)).not.toBeValid();
  });

  test('valid urls with other options', () => {
    expect(url('sander.com', { require_protocol: true })).not.toBeValid();
  });
});
