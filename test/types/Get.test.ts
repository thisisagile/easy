import { Dev } from '../ref/Dev';
import { Get, GetProperty, isFunction, ofGet, ofProperty } from '../../src/types';

describe('Get', () => {

  const name = (d: Get<Dev, string>): string => isFunction(d) ? d().name : d.name;

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



