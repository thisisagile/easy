import { Name, name, toJson } from '../../../src';

describe('Name', () => {
  const j = { first: 'Kevin', last: 'Huijsman' };
  const n = new Name(j);

  test('toJSON', () => {
    expect(toJson(n)).toStrictEqual(j);
  });

  test('toString of empty name', () => {
    const ne = new Name({ first: undefined, middle: undefined, last: undefined });
    expect(ne.toString()).toBe('');
  });

  test('toString of undefined', () => {
    const ne = new Name(undefined);
    expect(ne.toString()).toBe('');
  });

  test('toString of name without middle', () => {
    const ne = name({ first: 'Joyce', last: 'Assaad' });
    expect(ne.toString()).toBe('Joyce Assaad');
  });

  test('toString of name with middle', () => {
    const ne = name({ first: 'Wouter', middle: 'van', last: 'Bakel' });
    expect(ne.toString()).toBe('Wouter van Bakel');
  });
});
