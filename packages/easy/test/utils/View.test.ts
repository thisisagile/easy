import '@thisisagile/easy-test';
import { isInOut, toViewers, View, view } from '../../src';
import { Dev } from '../ref';


describe('View', () => {

  test('construct default view', () => {
    const v = new View();
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('scratch');
  });

  test('construct non-default view', () => {
    const v = new View({}, 'source');
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('source');
  });

  test('construct from view()', () => {
    const v = view({}, 'source');
    expect(v.viewers).toHaveLength(0);
    expect(v.startsFrom).toBe('source');
  });


  test('construct with actual view', () => {
    const persons = view({ first: 'FirstName' });
    expect(persons.viewers).toHaveLength(1);
    expect(persons.startsFrom).toBe('scratch');
  });

  test('from scratch and from source', () => {
    const source = {
      FirstName: 'Sander',
      LastName: 'H',
    };
    const fromScratch = view({}, 'scratch');
    const fromSource = view({}, 'source');
    expect(fromScratch.from(source)).toStrictEqual({});
    expect(fromSource.from(source)).toStrictEqual(source);
    expect(fromSource.from(Dev.Wouter)).toStrictEqual(Dev.Wouter.toJSON());
  });

  test('isInOut', () => {
    const v = view({});
    expect(isInOut(undefined)).toBeFalsy();
    expect(isInOut({})).toBeFalsy();
    expect(isInOut({ in: {} })).toBeFalsy();
    expect(isInOut({ out: {} })).toBeFalsy();
    expect(isInOut({ in: () => '' })).toBeTruthy();
    expect(isInOut({ in: v })).toBeTruthy();
    expect(isInOut({ in: v, col: 'name' })).toBeTruthy();
  });

  test('toViewers empty', () => {
    expect(toViewers({})).toHaveLength(0);
  });

  const call = (f?: (a: any) => unknown, a?: any): unknown => f && f(a);

  test('toViewers string column', () => {
    const vs = toViewers({ first: 'FirstName' });
    expect(vs).toHaveLength(1);
    expect(vs[0]?.in?.key).toBe('first');
    expect(call(vs[0]?.in?.f, { FirstName: 'Sander' })).toBe('Sander');
  });

  test('toViewers string column with dot notation', () => {
    const vs = toViewers({ first: 'Name.First' });
    expect(call(vs[0]?.in?.f, { Name: {First: 'Sander' } })).toBe('Sander');
  });

  test('toViewers string column with function', () => {
    const vs = toViewers({ first: a => a.Name.First.toUpperCase() });
    expect(call(vs[0]?.in?.f, { Name: {First: 'Sander' } })).toBe('SANDER');
  });

  test('toViewers string column with array function', () => {
    const vs = toViewers({ scopes: a => a.Scopes.map((s: string) => s.toUpperCase()) });
    expect(call(vs[0]?.in?.f, { Scopes: ['tech', 'support', 'hr'] })).toStrictEqual(['TECH', 'SUPPORT', 'HR'] );
  });

});
