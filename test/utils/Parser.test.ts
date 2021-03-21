import { Dev } from '../ref';
import { toText } from '../../src';
import '@thisisagile/easy-test';

describe('toString', () => {
  test('type', () => {
    expect(toText(undefined, '{type}')).toMatchText('');
    expect(toText(Dev.Sander, '')).toMatchText('');
    expect(toText(Dev.Sander, '{type}')).toMatchText('dev');
    expect(toText(Dev.Sander, '{type.title}')).toMatchText('Dev');
  });

  test('subject', () => {
    expect(toText(undefined, '{this}')).toMatchText('');
    expect(toText(Dev.Sander, '{this.name}')).toMatchText('Sander');
  });

  test('actual', () => {
    expect(toText(Dev.Sander, '{actual}', { actual: 'good' })).toMatchText('good');
    expect(toText(Dev.Sander, '{actual.upper}', { actual: 'good' })).toMatchText('GOOD');
  });

  test('property', () => {
    expect(toText(Dev.Sander, '{property}', { property: 'name' })).toMatchText('name');
    expect(toText(Dev.Sander, '{property.title}', { property: 'name' })).toMatchText('Name');
  });

  const template = '{this.level} {this.name} {this.language.lower.title} {this.language.lower} {type} {property.upper} {actual.lower}';

  test('the full monty', () => {
    expect(
      toText(Dev.Jeroen, template, {
        property: 'language',
        actual: 'C',
      })
    ).toMatchText('3 Jeroen Typescript typescript dev LANGUAGE c');
  });
});
