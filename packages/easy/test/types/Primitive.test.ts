import { isPrimitive } from '../../src';
import { Dev } from '../ref';

describe('isPrimitive', () => {
  const valids = [null, '', 'Hi', 123, true, false, undefined];
  const invalids = [{}, Dev, Dev.Eugen, () => true, []];

  test('Check with nothing', () => {
    expect(isPrimitive()).toBeTruthy();
  });

  test.each(valids)('%s is a valid primitive', v => {
    expect(isPrimitive(v)).toBeTruthy();
  });

  test.each(invalids)('%s is not a valid primitive', v => {
    expect(isPrimitive(v)).toBeFalsy();
  });
});
