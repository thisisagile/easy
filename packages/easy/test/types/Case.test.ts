import { choose, isEmpty, isHttpStatus, isObject, isString } from '../../src';
import { Dev } from '../ref';

describe('Case', () => {
  const which = (name: string) =>
    choose(name)
      .case(
        n => isEmpty(n),
        () => Dev.Jeroen
      )
      .case(
        n => n?.includes('an'),
        () => Dev.Naoufal
      )
      .case(
        n => n?.includes('San'),
        () => Dev.Sander
      )
      .else(Dev.Wouter);

  test('Simple true', () => {
    const out = choose('')
      .case(true, () => Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Simple false', () => {
    const out = choose('')
      .case(false, () => Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('Double true, should find first', () => {
    const out = choose('')
      .case(true, () => Dev.Wouter)
      .case(true, () => Dev.Sander)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Double true with predicate, should find first', () => {
    const out = choose('sander')
      .case(
        s => s.includes('and'),
        () => Dev.Sander
      )
      .case(true, () => Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('Simple true, with function outcome', () => {
    const out = choose('Bas')
      .case(true, name => new Dev({ name }))
      .else(Dev.Naoufal);
    expect(out?.name).toBe('Bas');
  });

  test('Full choose case', () => {
    expect(which('')).toMatchObject(Dev.Jeroen);
    expect(which('an')).toMatchObject(Dev.Naoufal);
    expect(which('San')).toMatchObject(Dev.Naoufal);
    expect(which('Kim')).toMatchObject(Dev.Wouter);
  });

  const typeIt = (a: unknown): string =>
    choose(a)
      .case(isString, () => 'A string')
      .case(isObject, () => 'An object')
      .type(isHttpStatus, h => h.name)
      .else('None');

  test('Testing type', () => {
    expect(typeIt(undefined)).toBe('None');
    expect(typeIt('hoi')).toBe('A string');
    expect(typeIt(Dev.Naoufal)).toBe('An object');
  });
});
