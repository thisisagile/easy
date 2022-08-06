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

describe('Check is.defined', () => {
  // is.defined

  const first = 'Sander';
  const last = 'Hoogendoorn';

  test('is.defined', () => {
    const out = choose({ first })
      .is.defined(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.defined invalid, then valid', () => {
    const out = choose({ last, name: undefined })
      .is.defined(
        d => d.name,
        () => Dev.Wouter
      )
      .is.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('is.defined valid, second is not valid', () => {
    const out = choose({ last, first })
      .is.defined(
        d => d.first,
        () => Dev.Wouter
      )
      .if.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('case is false, then is.defined is valid', () => {
    const out = choose({ last, first })
      .case(
        d => d.first === 'Rob',
        () => Dev.Rob
      )
      .if.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  // is.not.defined

  test('is.not.defined', () => {
    const out = choose({ first: undefined })
      .is.not.defined(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.not.defined invalid, then valid', () => {
    const out = choose({ last: undefined, first })
      .is.not.defined(
        d => d.first,
        () => Dev.Wouter
      )
      .is.not.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('is.not.defined valid, second is not valid', () => {
    const out = choose({ last, first })
      .is.not.defined(
        d => d.first,
        () => Dev.Wouter
      )
      .if.not.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('case is false, then is.not.defined is valid', () => {
    const out = choose({ last: undefined, first })
      .case(
        d => d.first === 'Rob',
        () => Dev.Rob
      )
      .if.not.defined(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });
});

describe('Check is.empty', () => {

  // is.empty

  const first = 'Sander';
  const last = 'Hoogendoorn';

  test('is.empty', () => {
    const out = choose({ first: '' })
      .is.empty(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.empty invalid, then valid', () => {
    const out = choose({ last, name: '' })
      .is.empty(
        d => d.name,
        () => Dev.Wouter
      )
      .is.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.empty valid, second is not valid', () => {
    const out = choose({ last: '', first })
      .is.empty(
        d => d.first,
        () => Dev.Wouter
      )
      .if.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('case is false, then is.empty is valid', () => {
    const out = choose({ last: '', first })
      .case(
        d => d.first === 'Rob',
        () => Dev.Rob
      )
      .if.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

// is.not.empty

  test('is.not.empty', () => {
    const out = choose({ first })
      .is.not.empty(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.not.empty invalid, then valid', () => {
    const out = choose({ last, first: '' })
      .is.not.empty(
        d => d.first,
        () => Dev.Wouter
      )
      .is.not.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('is.not.empty valid, second is not valid', () => {
    const out = choose({ last: '', first: '' })
      .is.not.empty(
        d => d.first,
        () => Dev.Wouter
      )
      .if.not.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('case is false, then is.not.empty is valid', () => {
    const out = choose({ last, first })
      .case(
        d => d.first === 'Rob',
        () => Dev.Rob
      )
      .if.not.empty(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });
});


describe('Check is.valid', () => {

  // is.valid

  const first = Dev.Sander;
  const last = Dev.Rob;

  test('is.empty', () => {
    const out = choose({ first })
      .is.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.valid invalid, then valid', () => {
    const out = choose({ last, first })
      .is.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .is.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.valid valid, second is not valid', () => {
    const out = choose({ last: Dev.Wouter, first: Dev.Invalid })
      .is.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .if.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('case is false, then is.valid is valid', () => {
    const out = choose({ last, first })
      .case(
        d => d.first === Dev.Jeroen,
        () => Dev.Rob
      )
      .if.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

// is.not.empty

  test('is.not.valid', () => {
    const out = choose({ first: Dev.Invalid })
      .is.not.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Wouter);
  });

  test('is.not.valid invalid, then valid', () => {
    const out = choose({ last: Dev.Invalid, first })
      .is.not.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .is.not.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });

  test('is.not.valid valid, second is not valid', () => {
    const out = choose({ last, first })
      .is.not.valid(
        d => d.first,
        () => Dev.Wouter
      )
      .if.not.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Naoufal);
  });

  test('case is false, then is.not.valid is valid', () => {
    const out = choose({ last: Dev.Invalid, first })
      .case(
        d => d.first === Dev.Jeroen,
        () => Dev.Rob
      )
      .if.not.valid(
        d => d.last,
        () => Dev.Sander
      )
      .else(Dev.Naoufal);
    expect(out).toMatchObject(Dev.Sander);
  });
});

