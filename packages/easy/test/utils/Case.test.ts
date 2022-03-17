import { choose, isEmpty, isObject, isString } from '../../src';
import { Dev } from '../ref';

describe('Case', () => {
  const which = (name: string) =>
    choose<Dev, string>(name)
      .case(n => isEmpty(n), Dev.Jeroen)
      .case(n => n?.includes('an'), Dev.Naoufal)
      .case(n => n?.includes('San'), Dev.Sander)
      .else(Dev.Wouter);

  test('Only else', () => {
    const out = choose<Dev>('').else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('Empty else', () => {
    const out = choose<Dev, string>('').else(Dev.Wouter);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Simple true', () => {
    const out = choose<Dev>('').case(true, Dev.Wouter).else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Double true, should find first', () => {
    const out = choose<Dev>('').case(true, Dev.Wouter).case(true, Dev.Sander).else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Double true with predicate, should find first', () => {
    const out = choose<Dev, string>('sander')
      .case(s => s.includes('and'), Dev.Sander)
      .case(true, Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('Simple true, with function outcome', () => {
    const out = choose<Dev>('Bas')
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
    choose<string>(a)
      .type(isString, 'A string')
      .type(isObject, 'An object')
      .else('None');

  test('Testing type', () => {
    expect(typeIt(undefined)).toBe('None');
    expect(typeIt('hoi')).toBe('A string');
    expect(typeIt(Dev.Naoufal)).toBe('An object');
  });
});
