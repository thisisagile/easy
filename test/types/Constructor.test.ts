import { Dev, DevUri } from '../ref';
import { toName } from '../../src';

describe('toName', () => {
  test('check', () => {
    expect(toName(undefined)).toBe('');
    expect(toName(Dev.Naoufal)).toBe('dev');
    expect(toName(DevUri.Developers, 'Uri')).toBe('dev');
  });
});
