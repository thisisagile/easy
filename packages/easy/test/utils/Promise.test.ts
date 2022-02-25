import { reject, resolve, toResults, tuple, when } from '../../src';
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

describe('tuple', () => {

  class Dev {
    constructor(readonly name: string) {
    }
  }

  class Manager {
    constructor(readonly role: string) {
    }
  }

  const asyncManager = (m: Manager): Promise<Manager> => resolve(new Manager(m.role + ' easy.ts'));

  const join = (d: Dev, m: Manager): string => `${d.name} ${m.role}`;

  test('resolve grab', async () => {
    const d = new Dev('Sander');
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple(d, new Manager('CTO')))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO');
  });

  test('resolve async grab', async () => {
    const d = new Dev('Sander');
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple(d, asyncManager(new Manager('CTO'))))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO easy.ts');
  });

});
