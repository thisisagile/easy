import { toString, isText } from '../../src';
import { Dev } from '../ref';

describe('isText', () => {
  const has = { toString: 3 };

  test('correct', () => {
    expect(isText()).toBeFalsy();
    expect(isText(3)).toBeTruthy();
    expect(isText(has)).toBeFalsy();
    expect(isText({})).toBeTruthy();
    expect(isText('Hello')).toBeTruthy();
    expect(isText(Dev.Jeroen)).toBeTruthy();
  });

  test('ifText without alt', () => {
    expect(toString()).toBe('');
    expect(toString('hallo')).toBe('hallo');
    expect(toString(Dev.Jeroen)).toBe('Jeroen');
  });

  test('ifText with alt', () => {
    expect(toString(undefined, 'alt')).toBe('alt');
    expect(toString(undefined, () => 'alt')).toBe('alt');
    expect(toString(has, () => 'alt')).toBe('alt');
    expect(toString('hallo', 'alt')).toBe('hallo');
    expect(toString(Dev.Jeroen, Dev.Naoufal)).toBe('Jeroen');
  });
});
