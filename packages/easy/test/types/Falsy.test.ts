import { isFalsy, isTruthy } from '../../src';
import { Dev } from '../ref';

describe('isFalsy', () => {
  const valids = [false, null, undefined, '', 0, -0, 0n, '', ``];
  const invalids = ['Hi', 123, true, {}, Dev, Dev.Eugen, () => true, [], 1n];

  test('Check with nothing', () => {
    expect(isFalsy()).toBeTruthy();
  });

  test.each(valids)('%s is falsy', v => {
    expect(isFalsy(v)).toBeTruthy();
  });

  test.each(invalids)('%s is not falsy', v => {
    expect(isFalsy(v)).toBeFalsy();
  });
});

describe('isTruthy', () => {
  const valids = ['Hi', 123, true, {}, Dev, Dev.Eugen, () => true, [], 1n];
  const invalids = [false, null, undefined, '', 0, -0, 0n, '', ``];

  test('Check with nothing', () => {
    expect(isTruthy()).toBeFalsy();
  });

  test.each(valids)('%s is truthy', v => {
    expect(isTruthy(v)).toBeTruthy();
  });

  test.each(invalids)('%s is not truthy', v => {
    expect(isTruthy(v)).toBeFalsy();
  });
});
