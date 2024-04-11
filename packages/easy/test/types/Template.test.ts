import { Dev } from '../ref';
import { template, Template } from '../../src';
import '@thisisagile/easy-test';

describe('Template', () => {
  test('constructor', () => {
    expect(new Template('')).toBeInstanceOf(Template);
    expect(new Template('', '', {})).toBeInstanceOf(Template);
  });

  test('type', () => {
    expect(template('', Dev.Sander)).toMatchText('');
    expect(template('{type}', undefined)).toMatchText('');
    expect(template('{type}', Dev.Sander)).toMatchText('dev');
    expect(template('{type.title}', Dev.Sander)).toMatchText('Dev');
  });

  test('this', () => {
    expect(template('{this}', undefined)).toMatchText('');
    expect(template('{this.name}', Dev.Sander)).toMatchText('Sander');
  });

  test('actual', () => {
    expect(template('{actual}', Dev.Sander, { actual: 'good' })).toMatchText('good');
    expect(template('{actual.upper}', Dev.Sander, { actual: 'good' })).toMatchText('GOOD');
    expect(template('{actual}', Dev.Sander, { actual: JSON.stringify({ id: 42 }) })).toMatchText('{"id":42}');
  });

  test('subject', () => {
    expect(template('{subject}', Dev.Sander)).toMatchText(JSON.stringify(Dev.Sander));
  });

  test('property', () => {
    expect(template('{property}', Dev.Sander, { property: 'name' })).toMatchText('name');
    expect(template('{property.title}', Dev.Sander, { property: 'name' })).toMatchText('Name');
  });

  const temp = '{this.level} {this.name} {this.language.lower.title} {this.language.lower} {type} {property.upper} {actual.lower}';

  test('the full monty', () => {
    expect(
      template(temp, Dev.Jeroen, {
        property: 'language',
        actual: 'C',
      })
    ).toMatchText('3 Jeroen Typescript typescript dev LANGUAGE c');
  });

  test('more', () => {
    const temp = 'We want to work with {this.name}';
    expect(template(temp, Dev.Wouter)).toMatchText('We want to work with Wouter');
  });

  test('template is undefined', () => {
    expect(template(undefined as unknown as string, Dev.Wouter)).toMatchText('');
  });
});
