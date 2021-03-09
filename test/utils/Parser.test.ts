import { Dev } from '../ref';
import { toText } from '../../src';
import '@thisisagile/easy-test';

describe('toString', () => {
  test('type', () => {
    expect(toText(Dev.Sander, '')).toMatchText('');
    expect(toText(undefined, '{type.name}')).toMatchText('');
    expect(toText(Dev.Sander, '{type.name}')).toMatchText('dev');
    expect(toText(Dev.Sander, '{type.Name}')).toMatchText('Dev');
  });

  test('subject', () => {
    expect(toText(undefined, '{subject.name}')).toMatchText('');
    expect(toText(Dev.Sander, '{subject.name}')).toMatchText('sander');
    expect(toText(Dev.Sander, '{subject.Name}')).toMatchText('Sander');
  });

  test('actual', () => {
    expect(toText(Dev.Sander, '{actual}', { actual: 'good' })).toMatchText('good');
    expect(toText(Dev.Sander, '{Actual}', { actual: 'good' })).toMatchText('Good');
  });

  test('property', () => {
    expect(toText(Dev.Sander, '{property}', { property: 'name' })).toMatchText('name');
    expect(toText(Dev.Sander, '{Property}', { property: 'name' })).toMatchText('Name');
  });

  test('props', () => {
    expect(toText(Dev.Sander, '{this.id}.{this.name}.{this.level}')).toMatchText('3.Sander.3');
  });
});
