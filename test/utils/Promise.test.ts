import { reject, resolve } from '../../src/utils';
import { Dev } from '../ref/Dev';
import { results } from '../../src/types';
import '@thisisagile/easy-test';

describe('Promise', () => {

  test('resolve', () => {
    return expect(resolve(Dev.Sander)).resolves.toMatchObject(Dev.Sander);
  });

  test('reject', async () => {
    await expect(reject('Wrong')).rejects.not.toBeValid();
    await expect(reject(results('Very wrong'))).rejects.not.toBeValid();
    return expect(reject(new Error('Also wrong'))).rejects.toBeInstanceOf(Error);
  });
});
