import { reject, resolve, toResults } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';

describe('Promise', () => {
  test('resolve', () => {
    return expect(resolve(Dev.Sander)).resolves.toMatchObject(Dev.Sander);
  });

  test('reject', async () => {
    await expect(reject('Wrong')).rejects.not.toBeValid();
    await expect(reject(toResults('Very wrong'))).rejects.not.toBeValid();
    return expect(reject(new Error('Also wrong'))).rejects.toBeInstanceOf(Error);
  });
});
