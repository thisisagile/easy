import { Dev } from '../ref';
import { toText } from '../../src';

describe('toString', () => {
  test('type', () => {
    expect(toText(Dev.Sander, '')).toBe('');
    expect(toText(undefined, '{type.name}')).toBe('');
    expect(toText(Dev.Sander, '{type.name}')).toBe('dev');
    expect(toText(Dev.Sander, '{type.Name}')).toBe('Dev');
  });

  test('subject', () => {
    expect(toText(undefined, '{subject.name}')).toBe('');
    expect(toText(Dev.Sander, '{subject.name}')).toBe('sander');
    expect(toText(Dev.Sander, '{subject.Name}')).toBe('Sander');
  });

  test('actual', () => {
    expect(toText(Dev.Sander, '{actual}', { actual: 'good' })).toBe('good');
    expect(toText(Dev.Sander, '{Actual}', { actual: 'good' })).toBe('Good');
  });

  test('property', () => {
    expect(toText(Dev.Sander, '{property}', { property: 'name' })).toBe('name');
    expect(toText(Dev.Sander, '{Property}', { property: 'name' })).toBe('Name');
  });

  test('props', () => {
    expect(toText(Dev.Sander, '{this.id}.{this.name}.{this.level}')).toBe('3.Sander.3');
  });
});
