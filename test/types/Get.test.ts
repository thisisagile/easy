import { Dev } from '../ref';
import { Get, GetProperty, ifGet, isFunc, ofGet, ofProperty, toList } from '../../src';

describe('Get', () => {
  const name = (d: Get<Dev, string>): string => (isFunc<Dev, string>(d) ? d().name : d.name);

  test('Get works', () => {
    expect(name(Dev.Sander)).toBe(Dev.Sander.name);
    expect(name(() => Dev.Sander)).toBe(Dev.Sander.name);
  });

  test('ofGet works', () => {
    expect(ofGet(Dev.Sander.name)).toBe(Dev.Sander.name);
    expect(ofGet(Dev.Sander.name, 'Hoi')).toBe(Dev.Sander.name);
    expect(ofGet(name, Dev.Sander)).toBe(Dev.Sander.name);
    expect(ofGet(name, Dev.Sander)).toBe(Dev.Sander.name);
    expect(ofGet(name, () => Dev.Sander)).toBe(Dev.Sander.name);
  });
});

describe('GetProperty', () => {
  const prop = (d: Dev, p: GetProperty<Dev, string>): string => ofProperty(d, p);

  test('ofProperty works', () => {
    expect(prop(Dev.Sander, d => d.name)).toBe(Dev.Sander.name);
    expect(prop(Dev.Sander, 'name')).toBe(Dev.Sander.name);
  });
});

describe('ifGet', () => {
  const empty = toList();
  const filled = toList(Dev.Naoufal);

  test('ifGet invalid', () => {
    expect(ifGet(undefined, 'Yes', 'No')).toBe('No');
    expect(ifGet(null, 'Yes', 'No')).toBe('No');
    expect(ifGet(0, 'Yes', 'No')).toBe('No');
    expect(ifGet('', 'Yes', 'No')).toBe('No');
    expect(ifGet(false, 'Yes', 'No')).toBe('No');
    expect(ifGet(empty.length, 'Yes', 'No')).toBe('No');
    expect(ifGet(() => 0, 'Yes', 'No')).toBe('No');
  });

  test('ifGet valid', () => {
    expect(ifGet(1, 'Yes', 'No')).toBe('Yes');
    expect(ifGet({}, 'Yes', 'No')).toBe('Yes');
    expect(ifGet('1', 'Yes', 'No')).toBe('Yes');
    expect(ifGet(true, 'Yes', 'No')).toBe('Yes');
    expect(ifGet(filled.length, 'Yes', 'No')).toBe('Yes');
    expect(ifGet(() => 1, 'Yes', 'No')).toBe('Yes');
  });
});
