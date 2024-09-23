import '@thisisagile/easy-test';
import { accumulate, Audit, traverse, traverseSet } from '../../src';
import { Dev } from '../ref';

describe('traverse', () => {
  test('traverse with empty subject', () => {
    expect(traverse(undefined, '')).toBeUndefined();
  });

  test('traverse with null subject', () => {
    expect(traverse(null, '')).toBeUndefined();
  });

  test('traverse with false subject', () => {
    expect(traverse(false, '')).toBeUndefined();
  });

  test('traverse with null subject nested', () => {
    expect(traverse({ group: null }, 'group.name')).toBeUndefined();
  });

  test('traverse with undefined subject nested', () => {
    expect(traverse({ group: undefined }, 'group.name')).toBeUndefined();
  });

  test('traverse with undefined property', () => {
    expect(traverse(Dev.Jeroen, undefined as unknown as string)).toBeUndefined();
  });

  test('traverse with empty property', () => {
    expect(traverse(Dev.Jeroen, '')).toBeUndefined();
  });

  test('traverse with non-existing property', () => {
    expect(traverse(Dev.Jeroen, 'bsn')).toBeUndefined();
  });

  test('traverse with existing property', () => {
    expect(traverse(Dev.Jeroen, 'name')).toBe('Jeroen');
    expect(traverse(Dev.Jeroen, 'created')).toBeInstanceOf(Audit);
  });

  test('traverse with non-existing nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.outOf')).toBeUndefined();
  });

  test('traverse with existing nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.by')).toStrictEqual({ id: 0, user: 'easy' });
  });

  test('traverse with existing double-nested property', () => {
    expect(traverse(Dev.Jeroen, 'created.by.id')).toBe(0);
  });

  test('traverse with existing triple-nested property', () => {
    expect(traverse({}, 'created.by.id')).toBeUndefined();
  });
});

describe('traverseSet', () => {
  const original = {
    id: 42,
    name: { first: 'Sander', last: 'Hoogendoorn', income: { currency: 'EUR', cents: '1000' } },
  };

  test('traverseSet known prop and value', () => {
    expect(traverseSet(original, 'id', 43)).toStrictEqual({ ...original, id: 43 });
  });

  test('traverseSet known level 2 prop', () => {
    expect(traverseSet(original, 'name.first', 'Boet')).toStrictEqual({
      ...original,
      name: { first: 'Boet', last: 'Hoogendoorn', income: { currency: 'EUR', cents: '1000' } },
    });
  });

  test('traverseSet known level 3 prop', () => {
    expect(traverseSet(original, 'name.income.currency', 'PLN')).toStrictEqual({
      ...original,
      name: { first: 'Sander', last: 'Hoogendoorn', income: { currency: 'PLN', cents: '1000' } },
    });
  });
});

describe('accumulate', () => {
  test('accumulate', () => {
    const data = [
      { hour: '09:00', app: 4, website: 5, nested: { value: 2 } },
      { hour: '10:00', app: 6, website: 7, nested: { value: 2 } },
      { hour: '11:00', app: 8, website: 9, nested: { value: 3 } },
    ];

    const accumulatedData = [
      { hour: '09:00', app: 4, website: 5, nested: { value: 2 } },
      { hour: '10:00', app: 10, website: 12, nested: { value: 4 } },
      { hour: '11:00', app: 18, website: 21, nested: { value: 7 } },
    ];

    const acc = accumulate(data, 'app', 'website', 'nested.value');
    acc.map((d, i) => expect(d).toMatchObject(accumulatedData[i]));
  });
});
