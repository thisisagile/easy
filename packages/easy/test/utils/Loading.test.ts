import '@thisisagile/easy-test';
import { isLoading } from '../../src';
import { Dev } from '../ref';

describe('Loading', () => {
  const isTrue: [string, unknown][] = [
    ['undefined', undefined],
    ['null', null],
    ['empty string', ''],
    ['empty object', {}],
    ['empty array', []],
  ];

  test.each(isTrue)('is true when %s', (name: string, o: unknown) => {
    expect(isLoading(o)).toBeTruthy();
  });

  const isFalse: [string, unknown][] = [
    ['a number', 0],
    ['a boolean', false],
    ['a string', 'false'],
    ['an object', { valid: 'false' }],
    ['an entity', Dev.Wouter],
    ['an array', ['', '']],
  ];

  test.each(isFalse)('is false when %s', (name: string, o: unknown) => {
    expect(isLoading(o)).toBeFalsy();
  });

  test('spreads that are loading', () => {
    expect(isLoading(undefined, undefined)).toBeTruthy();
    expect(isLoading('undefined', undefined)).toBeTruthy();
    expect(isLoading(Dev.Eugen, undefined)).toBeTruthy();
    expect(isLoading([], undefined)).toBeTruthy();
    expect(isLoading([], [])).toBeTruthy();
  });

  test('spreads that are not loading', () => {
    expect(isLoading('undefined', 'undefined')).toBeFalsy();
    expect(isLoading('undefined', Dev.Rob)).toBeFalsy();
    expect(isLoading(Dev.Eugen, Dev.Jeroen)).toBeFalsy();
    expect(isLoading([Dev.Eugen], Dev.Jeroen)).toBeFalsy();
    expect(isLoading([Dev.Eugen], [Dev.Jeroen])).toBeFalsy();
  });
});
