import '@thisisagile/easy-test';
import { mock } from '@thisisagile/easy-test';
import { Dev } from '../ref';
import { log } from '../../src';

describe('Log', () => {
  test('log', () => {
    console.log = mock.return();
    expect(log(Dev.Sander)).toBe(Dev.Sander);
    expect(console.log).toHaveBeenCalledWith(Dev.Sander);
  });
});
