import { reject, resolve } from '../../src/utils';
import { Dev } from '../ref/Dev';
import { results, Results } from '../../src/types';

describe('Promise', () => {

  test('resolve', () => {
    return expect(resolve(Dev.Sander)).resolves.toMatchObject(Dev.Sander);
  });

  test('reject', async () => {
    await expect(reject('Wrong')).rejects.toBeInstanceOf(Results);
    await expect(reject(results('Very wrong'))).rejects.toBeInstanceOf(Results);
    return expect(reject(new Error('Also wrong'))).rejects.toBeInstanceOf(Error);
  });
});
