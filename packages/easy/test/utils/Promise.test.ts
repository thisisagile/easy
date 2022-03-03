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

  const d = new Dev('Sander');
  const ceo = new Manager('CEO');
  const cto = new Manager('CTO');

  const asyncM = (m: Manager): Promise<Manager> => resolve(new Manager(m.role + ' easy'));

  const join = (...people: (Dev | Manager)[]): string => people.map(p => p.toString()).join(' ');

  test('resolve sync tuple', async () => {
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple[2](d, cto))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO');
  });

  test('resolve sync plus async tuple', async () => {
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple[2](d, asyncM(cto)))
      .then(([d, m]) => join(d, m));

    expect(res).toBe('Sander CTO easy');
  });

  test('resolve async tuple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple[2](asyncM(c), asyncM(c)))
      .then(([m, m2]) => join(m, m2));

    expect(res).toBe('CEO easy CEO easy');
  });

  test('resolve sync and async triple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple[3](d, asyncM(c), asyncM(c)))
      .then(([d, m, m2]) => join(d, m, m2));

    expect(res).toBe('Sander CEO easy CEO easy');
  });

  test('resolve sync and async quadruple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple[4](d, asyncM(c), asyncM(c), d))
      .then(([, , , d]) => d);

    expect(res).toBeInstanceOf(Dev);
  });

});
