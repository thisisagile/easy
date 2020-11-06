import { Dev } from '../ref/Dev';
import { Get, isFunction, ofGet } from '../../src/types';

describe('Get', () => {

  const name = (d: Get<string, Dev>): string => isFunction(d) ? d().name : d.name;

  test('Get works', () => {
    expect(name(Dev.Sander)).toBe(Dev.Sander.name);
    expect(name(() => Dev.Sander)).toBe(Dev.Sander.name);
  });

  test('ofGet works', () => {
    expect(ofGet(Dev.Sander.name)).toBe(Dev.Sander.name);
    expect(ofGet(Dev.Sander.name, "Hoi")).toBe(Dev.Sander.name);
    expect(ofGet(name, Dev.Sander)).toBe(Dev.Sander.name);
    expect(ofGet(name, Dev.Sander)).toBe(Dev.Sander.name);
    expect(ofGet(name, () => Dev.Sander)).toBe(Dev.Sander.name);
  });
});



