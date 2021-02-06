import { Dev } from '../ref';
import { asText } from '../../src';

describe('toString', () => {
  test('type', () => {
    expect(asText(Dev.Sander, '')).toBe('');
    expect(asText(undefined, '{type.name}')).toBe('');
    expect(asText(Dev.Sander, '{type.name}')).toBe('dev');
    expect(asText(Dev.Sander, '{type.Name}')).toBe('Dev');
  });

  test('subject', () => {
    expect(asText(undefined, '{subject.name}')).toBe('');
    expect(asText(Dev.Sander, '{subject.name}')).toBe('sander');
    expect(asText(Dev.Sander, '{subject.Name}')).toBe('Sander');
  });

  test('actual', () => {
    expect(asText(Dev.Sander, '{actual}', { actual: 'good' })).toBe('good');
    expect(asText(Dev.Sander, '{Actual}', { actual: 'good' })).toBe('Good');
  });

  test('property', () => {
    expect(asText(Dev.Sander, '{property}', { property: 'name' })).toBe('name');
    expect(asText(Dev.Sander, '{Property}', { property: 'name' })).toBe('Name');
  });

  test('props', () => {
    expect(asText(Dev.Sander, '{this.id}.{this.name}.{this.level}')).toBe('3.Sander.3');
  });
});
