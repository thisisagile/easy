import { reject, resolve, toResults, tuple } from '../../src';
import { Dev } from '../ref';
import '@thisisagile/easy-test';
import { Id, Json } from '@thisisagile/easy-test/dist/utils/Types';

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

describe('tupel', () => {
  const getName = (name: string): Promise<Json> => resolve({ name });
  const getLastName = (lastName: string): Promise<Json> => resolve({ lastName });
  const getId = (id: Id): Promise<Json> => resolve({ id });

  const doStuff = (id: Id): Promise<Json> => {
    return resolve(id)
      .then(i => getId(i))
      .then(j => tuple(j, getName('Sander'), getLastName('Hoogendoorn')))
      .then(([id, name, lastName]) => ({ ...id, ...name, ...lastName }))
      .then(({ id, name, lastName }) => ({ id, name, lastName }));
  };

  test('tupel returns both async and sync params', () => {
    return expect(doStuff(42)).resolves.toEqual({ id: 42, name: 'Sander', lastName: 'Hoogendoorn' });
  });
});
