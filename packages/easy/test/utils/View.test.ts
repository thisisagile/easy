import '@thisisagile/easy-test';
import { toViewers, View, view } from '../../src';
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

  test('toViewers empty', () => {
    expect(toViewers({})).toHaveLength(0);
  });

  test('view string column', () => {
    const v = view({ first: 'FirstName' });
    expect(v.viewers).toHaveLength(1);
    expect(v.viewers[0]?.in?.key).toBe('first');
    expect(v.from({ FirstName: 'Sander' })).toStrictEqual({ first: 'Sander' });
  });

  test('view string column with dot notation', () => {
    const v = view({ first: 'Name.FirstName' });
    expect(v.from({ Name: { FirstName: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view string column with function', () => {
    const v = view({ first: a => a.Name.First.toUpperCase() });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'SANDER' });
  });

  test('view string column with array function', () => {
    const v = view({ scopes: a => a.Scopes.map((s: string) => s.toUpperCase()) });
    expect(v.from({ Scopes: ['tech', 'support', 'hr'] })).toStrictEqual({ scopes: ['TECH', 'SUPPORT', 'HR'] });
  });

  test('view with an InOut, but only col', () => {
    const v = view({ first: { col: 'Name.First' } });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view with an InOut, but only in', () => {
    const v = view({ first: { in: a => a.Name.First } });
    expect(v.from({ Name: { First: 'Sander' } })).toStrictEqual({ first: 'Sander' });
  });

  test('view with an InOut, with col and function in', () => {
    const v = view({ first: { col: 'Company.Name', in: a => a.toUpperCase() } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: 'DITISAGILE' });
  });

  test('view with an InOut, with col and view in', () => {
    const v2 = view({ name: 'Name' });
    const v = view({ first: { col: 'Company', in: v2 } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: { name: 'ditisagile' } });
  });

  test('view with an InOut, with col and view in with col and function', () => {
    const v2 = view({ name: { col: 'Name', in: a => a.toUpperCase() } });
    const v = view({ first: { col: 'Company', in: v2 } });
    expect(v.from({ Company: { Name: 'ditisagile' } })).toStrictEqual({ first: { name: 'DITISAGILE' } });
  });


});
