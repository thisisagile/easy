import { Exception, List, reject, resolve, settled, toList, toResults, tuple, tuple2, tuple3, tuple4, tuple5, when } from '../../src';
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
    constructor(readonly name: string) {}

    toString(): string {
      return this.name;
    }
  }

  class Manager {
    constructor(readonly role: string) {}

    toString(): string {
      return this.role;
    }
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
      .then(c => tuple2(asyncM(c), asyncM(c)))
      .then(([m, m2]) => join(m, m2));

    expect(res).toBe('CEO easy CEO easy');
  });

  test('resolve sync and async triple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple3(d, asyncM(c), asyncM(c)))
      .then(([d, m, m2]) => join(d, m, m2));

    expect(res).toBe('Sander CEO easy CEO easy');
  });

  test('resolve sync and async quadruple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple4(d, asyncM(c), asyncM(c), d))
      .then(([, , , d]) => d);

    expect(res).toBeInstanceOf(Dev);
  });

  test('resolve sync and async quintuple', async () => {
    const res = await when(ceo)
      .not.isDefined.reject()
      .then(c => tuple5(asyncM(c), d, asyncM(c), asyncM(c), d))
      .then(([c]) => c);

    expect(res).toBeInstanceOf(Manager);
  });

  test('resolve sync and async array', async () => {
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple.all(d, [asyncM(ceo), asyncM(cto)]))
      .then(([, ms]) => ms);

    expect(res).toHaveLength(2);
    expect(res[1]).toBeInstanceOf(Manager);
  });

  test('resolve sync and async spread', async () => {
    const res = await when(d)
      .not.isDefined.reject()
      .then(d => tuple.spread(d, asyncM(ceo), asyncM(cto)))
      .then(([, ms]) => toList(ms));

    expect(res).toHaveLength(2);
    expect(res[1]).toBeInstanceOf(Manager);
  });

  test('resolve sync and async list', async () => {
    const res = await tuple.list([asyncM(ceo), asyncM(cto)]);
    expect(res).toHaveLength(2);
    expect(res).toBeInstanceOf(List);
    expect(res[1]).toBeInstanceOf(Manager);
  });

  test('tuple settled', async () => {
    const res = await tuple.settled([asyncM(ceo), asyncM(cto)]);
    expect(res.fulfilled).toHaveLength(2);
    expect(res.rejected).toHaveLength(0);
  });

  test('tuple settled when one promise rejects', async () => {
    const res = await tuple.settled([asyncM(ceo), reject(Exception.DoesNotExist)]);
    expect(res.fulfilled).toHaveLength(1);
    expect(res.rejected).toHaveLength(1);
    expect(res.rejected[0]).toBe('DoesNotExist');
  });

  test('tuple.serial', async () => {
    let str = '';
    const p1 = resolve(1).then(() => (str += 'a'));
    const p2 = resolve(1).then(() => (str += 'b'));
    await expect(tuple.serial([p1, p2])).resolves.toStrictEqual(toList('a', 'ab'));
  });

  test.each([undefined, null, toList()])('tuple settled on empty list', async a => {
    const res = await settled([a] as any);
    expect(res.fulfilled).toHaveLength(0);
    expect(res.rejected).toHaveLength(0);
  });
});
