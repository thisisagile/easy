import {ifText, isText} from '../../src';
import {Dev} from '../ref';

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
    expect(ifText()).toBe('');
    expect(ifText('hallo')).toBe('hallo');
    expect(ifText(Dev.Jeroen)).toBe('Jeroen');
  });

  test('ifText with alt', () => {
    expect(ifText(undefined, 'alt')).toBe('alt');
    expect(ifText(undefined, () => 'alt')).toBe('alt');
    expect(ifText(has, () => 'alt')).toBe('alt');
    expect(ifText('hallo', 'alt')).toBe('hallo');
    expect(ifText(Dev.Jeroen, Dev.Naoufal)).toBe('Jeroen');
  });
});