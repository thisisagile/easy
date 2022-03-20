import '@thisisagile/easy-test';
import { isInOut, View, view } from '../../src';


describe('View', () => {

  test('construct default view', () => {
    const v = new View();
    expect(v.views).toHaveLength(0);
    expect(v.from).toBe('scratch');
  });

  test('construct non-default view', () => {
    const v = new View([{}], 'source');
    expect(v.views).toHaveLength(1);
    expect(v.from).toBe('source');
  });

  test('construct from view()', () => {
    const v = view({}, 'source');
    expect(v.views).toHaveLength(0);
    expect(v.from).toBe('source');
  });


  test('construct with actual view', () => {
    const persons = view({ first: 'FirstName' });
    expect(persons.views).toHaveLength(0);
    expect(persons.from).toBe('scratch');
  });

  test('from scratch and from source', () => {
    const source = {
      FirstName: 'Sander',
      LastName: 'H',
    };
    const fromScratch = view({}, 'scratch');
    const fromSource = view({}, 'source');
    expect(fromScratch.in(source)).toStrictEqual({});
    expect(fromSource.in(source)).toStrictEqual(source);
  });

  test('isInOut', () => {
    const v = view({});
    expect(isInOut(undefined)).toBeFalsy();
    expect(isInOut({})).toBeFalsy();
    expect(isInOut({in: {}})).toBeFalsy();
    expect(isInOut({out: {}})).toBeFalsy();
    expect(isInOut({in: () => ''})).toBeTruthy();
    expect(isInOut({out: () => ''})).toBeTruthy();
    expect(isInOut({in: v})).toBeTruthy();
    expect(isInOut({out: v})).toBeTruthy();
    expect(isInOut({in: v, out: v, col: 'name'})).toBeTruthy();
  })

});
