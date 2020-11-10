import { isDefined } from '../../src/types';
import { Dev } from '../ref/Dev';
import { choose } from '../../src/utils';

describe('Case', () => {

  const wich = (name?: string) =>
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
    expect(wich()).toMatchObject(Dev.Jeroen);
    expect(wich('an')).toMatchObject(Dev.Naoufal);
    expect(wich('San')).toMatchObject(Dev.Naoufal);
    expect(wich('Kim')).toMatchObject(Dev.Wouter);
  });
});
