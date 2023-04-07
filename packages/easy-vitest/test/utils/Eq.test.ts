import { describe, expect, test } from 'vitest';
import { eq } from '../../src/utils/Eq';

describe('eq.string', () => {
  test('string false', () => {
    expect(eq.string('')).toBeFalsy();
    expect(eq.string('', 'Sander')).toBeFalsy();
    expect(eq.string('Jeroen', 'Sander')).toBeFalsy();
    expect(eq.string({}, 'Sander')).toBeFalsy();
    expect(eq.string(3, 'Sander')).toBeFalsy();
    expect(eq.string(3, 5)).toBeFalsy();
  });

  test('string true', () => {
    expect(eq.string()).toBeTruthy();
    expect(eq.string(3, 3)).toBeTruthy();
    expect(eq.string(3, '3')).toBeTruthy();
    expect(eq.string('Sander', 'Sander')).toBeTruthy();
    // Don't use string for objects :)
    expect(eq.string({}, { id: 3 })).toBeTruthy();
  });
});

describe('eq.sub', () => {
  test('sub false', () => {
    expect(eq.subset('')).toBeFalsy();
    expect(eq.subset('', 'Sander')).toBeFalsy();
    expect(eq.subset('Jeroen', 'Sander')).toBeFalsy();
    expect(eq.subset({}, 'Sander')).toBeFalsy();
    expect(eq.subset(3, 'Sander')).toBeFalsy();
    expect(eq.subset(3, 5)).toBeFalsy();
    expect(eq.subset(3, '3')).toBeFalsy();
    expect(eq.subset({}, { id: 3 })).toBeFalsy();
    expect(eq.subset({ id: 3, name: 'Naoufal' }, { id: 3, name: 'Wouter' })).toBeFalsy();
    expect(
      eq.subset(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { first: 'Wouter', last: 'Lamarti' },
        }
      )
    ).toBeFalsy();
  });

  test('sub true', () => {
    expect(eq.subset()).toBeTruthy();
    expect(eq.subset(3, 3)).toBeTruthy();
    expect(eq.subset('Sander', 'Sander')).toBeTruthy();
    expect(eq.subset({ id: 3 }, { id: 3 })).toBeTruthy();
    expect(eq.subset({ id: 3, name: 'Naoufal' }, {})).toBeTruthy();
    expect(eq.subset({ id: 3, name: 'Naoufal' }, { id: 3 })).toBeTruthy();
    expect(eq.subset({ id: 3, name: 'Naoufal' }, { id: 3, name: 'Naoufal' })).toBeTruthy();
    expect(
      eq.subset(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { last: 'Lamarti' },
        }
      )
    ).toBeTruthy();
    expect(
      eq.subset(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { first: 'Naoufal', last: 'Lamarti' },
        }
      )
    ).toBeTruthy();
  });
});

describe('eq.full', () => {
  test('full false', () => {
    expect(eq.exact('')).toBeFalsy();
    expect(eq.exact('', 'Sander')).toBeFalsy();
    expect(eq.exact('Jeroen', 'Sander')).toBeFalsy();
    expect(eq.exact({}, 'Sander')).toBeFalsy();
    expect(eq.exact(3, 'Sander')).toBeFalsy();
    expect(eq.exact(3, 5)).toBeFalsy();
    expect(eq.exact(3, '3')).toBeFalsy();
    expect(eq.exact({}, { id: 3 })).toBeFalsy();
    expect(eq.exact({ id: 3, name: 'Naoufal' }, {})).toBeFalsy();
    expect(eq.exact({ id: 3, name: 'Naoufal' }, { id: 3 })).toBeFalsy();
    expect(eq.exact({ id: 3, name: 'Naoufal' }, { id: 3, name: 'Wouter' })).toBeFalsy();
    expect(
      eq.exact(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { last: 'Lamarti' },
        }
      )
    ).toBeFalsy();
    expect(
      eq.exact(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { first: 'Wouter', last: 'Lamarti' },
        }
      )
    ).toBeFalsy();
  });

  test('full true', () => {
    expect(eq.exact()).toBeTruthy();
    expect(eq.exact(3, 3)).toBeTruthy();
    expect(eq.exact('Sander', 'Sander')).toBeTruthy();
    expect(eq.exact({ id: 3 }, { id: 3 })).toBeTruthy();
    expect(eq.exact({ id: 3, name: 'Naoufal' }, { id: 3, name: 'Naoufal' })).toBeTruthy();
    expect(
      eq.exact(
        { id: 3, name: { first: 'Naoufal', last: 'Lamarti' } },
        {
          id: 3,
          name: { first: 'Naoufal', last: 'Lamarti' },
        }
      )
    ).toBeTruthy();
  });
});
