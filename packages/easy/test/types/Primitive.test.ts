import { isPrimitive } from '../../src';
import { Dev } from '../ref';

describe('isPrimitive', () => {
  test('Check', () => {
    expect(isPrimitive()).toBeTruthy();
    expect(isPrimitive(null)).toBeTruthy();
    expect(isPrimitive('')).toBeTruthy();
    expect(isPrimitive({})).toBeFalsy();
    expect(isPrimitive(123)).toBeTruthy();
    expect(isPrimitive(false)).toBeTruthy();
    expect(isPrimitive(Dev)).toBeFalsy();
    expect(isPrimitive(Dev.Wouter)).toBeFalsy();
    expect(isPrimitive(() => true)).toBeFalsy();
    expect(isPrimitive([])).toBeFalsy();
  });
});
