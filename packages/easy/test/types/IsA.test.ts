import { isA } from '../../src';
import { Dev } from '../ref';

describe('IsA', () => {
  test('isA works', () => {
    expect(isA<Dev>()).toBeFalsy();
    expect(isA<Dev>({})).toBeTruthy();
    expect(isA<Dev>(Dev.Sander)).toBeTruthy();
    expect(isA<Dev>(Dev.Sander, 'name', 'language')).toBeTruthy();
  });
});
