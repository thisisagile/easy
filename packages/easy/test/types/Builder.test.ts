import { build, singleton } from '../../src';

const nl = 'The Netherlands';

class Person {
  constructor(readonly name: string, readonly city?: string, readonly country = nl) {}
}

describe('Builder', () => {
  beforeEach(() => {
    build.reset();
  });

  test('singleton returns', () => {
    const p = singleton(Person);
    expect(p).toBeInstanceOf(Person);
  });

  test('singleton returns with one param', () => {
    const p = singleton(Person, 'Kim');
    expect(p.name).toBe('Kim');
    expect(p.city).toBeUndefined();
    expect(p.country).toBe(nl);
  });

  test('singleton returns with two params', () => {
    const p = singleton(Person, 'Kim', 'Amsterdam');
    expect(p.name).toBe('Kim');
    expect(p.city).toBe('Amsterdam');
    expect(p.country).toBe(nl);
  });

  test('singleton returns the same object after it is created', () => {
    const p = singleton(Person, 'Kim');
    expect(p.name).toBe('Kim');
    const r = singleton(Person, 'Sander', 'Amsterdam');
    expect(r.name).toBe('Kim');
    expect(r.city).toBeUndefined();
  });
});
