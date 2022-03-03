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
    toString(): string { return this.name}
  }

  class Manager {
    constructor(readonly role: string) {
    }
    toString(): string { return this.role}
  }

  const asyncM = (m: Manager): Promise<Manager> => resolve(new Manager(m.role + ' easy.ts'));

  const join = (...people: (Dev | Manager)[]): string => people.map(p => p.toString()).join(' ');

  test('resolve tuple', async () => {
    const d = new Dev('Sander');
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple[2](d, new Manager('CTO')))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO');
  });

  test('resolve async tuple', async () => {
    const d = new Dev('Sander');
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple[2](d, asyncM(new Manager('CTO'))))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO easy.ts');
  });

});
