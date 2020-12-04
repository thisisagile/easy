import { choose, isDefined } from '../../src';
import { Dev } from '../ref';

describe('Case', () => {

  const which = (name?: string) =>
    choose<Dev, string>(name)
      .case(n => !isDefined(n), Dev.Jeroen)
      .case(n => n.includes('an'), Dev.Naoufal)
      .case(n => n.includes('San'), Dev.Sander)
      .else(Dev.Wouter);

  test('Only else', () => {
    const out = choose<Dev>('')
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('Empty else', () => {
    const out = choose<Dev, string>('')
      .else();
    expect(out).toBeUndefined();
  });

  test('Simple true', () => {
    const out = choose<Dev>('')
      .case(true, Dev.Wouter)
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('Double true, should find first', () => {
    const out = choose<Dev>('')
      .case(true, Dev.Wouter)
      .case(true, Dev.Sander)
      .else(Dev.Naoufal);
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
    expect(out.name).toBe('Bas');
  });

  test('Full choose case', () => {
    expect(which()).toMatchObject(Dev.Jeroen);
    expect(which('an')).toMatchObject(Dev.Naoufal);
    expect(which('San')).toMatchObject(Dev.Naoufal);
    expect(which('Kim')).toMatchObject(Dev.Wouter);
  });
});
