import { isNullish } from '../../src';
import { Dev } from '../ref';

describe('isNullish', () => {
  const valids = [null, undefined];
  const invalids = ['', 'Hi', 123, true, false, {}, Dev, Dev.Eugen, () => true, []];

  test('Check with nothing', () => {
    expect(isNullish()).toBeTruthy();
  });

  test.each(valids)('%s is nullish', v => {
    expect(isNullish(v)).toBeTruthy();
  });

  test.each(invalids)('%s is not nullish', v => {
    expect(isNullish(v)).toBeFalsy();
  });
});
