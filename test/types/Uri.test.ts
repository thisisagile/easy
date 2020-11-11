import { uri, Uri } from '../../src/types';

describe('Uri', () => {

  class TestUri extends Uri {

    static readonly first = uri.query('first');
    static readonly tests = uri.part('tests');

    static readonly Tests = new TestUri([TestUri.tests]);
    static readonly Test = new TestUri([TestUri.tests, TestUri.id]);

    first = (f: string): this => this.set(TestUri.first, f);
  }

  test('Returns correct type', () => {
    expect(TestUri.Tests).toBeInstanceOf(TestUri);
  });

  test('toString returns full route', () => {
    expect(TestUri.Tests.toString()).toBe('$host/$resource/tests');
    expect(TestUri.Test.toString()).toBe('$host/$resource/tests/:id');
  });

  test('route returns just route', () => {
    expect(TestUri.Tests.route).toBe('/tests');
    expect(TestUri.Test.route).toBe('/tests/:id');
  });

  test('complete returns just route', () => {
    expect(TestUri.Tests.complete).toBe('$host/$resource/tests');
    expect(TestUri.Test.complete).toBe('$host/$resource/tests/:id');
  });

  test('toString returns full route plus id', () => {
    expect(TestUri.Tests.id(42).toString()).toBe('$host/$resource/tests');
    expect(TestUri.Test.id(42).toString()).toBe('$host/$resource/tests/42');
  });

  test('toString returns full route plus id and a query', () => {
    expect(TestUri.Tests.query('yes').toString()).toBe('$host/$resource/tests?q=yes');
    expect(TestUri.Test.id(42).query('yes').toString()).toBe('$host/$resource/tests/42?q=yes');
  });

  test('toString returns full route plus id and two queries', () => {
    expect(TestUri.Tests.query('yes').first('Wouter').toString()).toBe('$host/$resource/tests?q=yes&first=Wouter');
    expect(TestUri.Test.id(42).query('yes').first('Wouter').toString()).toBe('$host/$resource/tests/42?q=yes&first=Wouter');
  });
});
