import { describe, expect, test } from 'vitest';
import { match } from '../../src';

class Subject {
  constructor(public topic: string) {}
}

const passed = 'Passes, which we did not expect.';

describe('match', () => {
  test('match should pass', () => {
    const c = match('Kim')
      .not(s => s === 'Kim', 'Fails')
      .else('Passes');

    expect(c.message()).toBe(passed);
  });

  test('match should pass with object', () => {
    const c = match(new Subject('Sander'))
      .not(s => s.topic === 'Sander', 'Fails')
      .else('Passes');

    expect(c.message()).toBe(passed);
  });

  test('match should fail with object', () => {
    const c = match(new Subject('Sander'))
      .not(s => s.topic === 'Jeroen', 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Fails');
  });

  test('match should fail with multiple clauses', () => {
    const c = match(new Subject('Sander'))
      .not(s => s.topic === 'Jeroen', 'Fails big')
      .not(s => s.topic === 'Wouter', 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Fails big');
  });

  test('match should fail with multiple clauses, one passes and another fails', () => {
    const c = match(new Subject('Sander'))
      .not(s => s.topic === 'Sander', 'Fails big again')
      .not(s => s.topic === 'Wouter', 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Fails');
  });

  test('match should fail', () => {
    const c = match({})
      .not(() => false, 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Fails');
  });

  test('match should fail with error', () => {
    const c = match({} as any)
      .not(() => {
        throw new Error('Crash');
      }, 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Crash');
  });

  test('match should fail with error if not exists', () => {
    const c = match({} as any)
      .undefined(() => undefined, 'Fails')
      .else('Passes');

    expect(c.message()).toBe('Fails');
  });

  test('match should fail with if not defined', () => {
    const c = match(new Subject('Sander') as any)
      .undefined(s => s.lastname, "Subject does not have a property 'lastname'.")
      .else('Passes');

    expect(c.message()).toBe("Subject does not have a property 'lastname'.");
  });

  test('match should not fail if exists', () => {
    const c = match(new Subject('Sander'))
      .undefined(s => s.topic, 'Fails')
      .else('Passes');

    expect(c.message()).toBe(passed);
  });

  test('match should not fail with error if exists', () => {
    const c = match('string')
      .undefined(s => s, 'Invalid')
      .else('Passes');

    expect(c.message()).toBe(passed);
  });
});
