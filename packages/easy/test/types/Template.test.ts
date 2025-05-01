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

  const tmpl = 'Contact {this.target.name}';
  test.each([
  [tmpl, {}, 'Contact '],
  [tmpl, null, 'Contact '],
  [tmpl, undefined, 'Contact '],
  ['Contact {this.target.name.lower}', undefined, 'Contact '],
])('template renders correctly with missing props for %s', (templateString, subject, expected) => {
  expect(template(templateString, subject)).toMatchText(expected);
});

  test('more', () => {
    const temp = 'We want to work with {this.name}';
    expect(template(temp, Dev.Wouter)).toMatchText('We want to work with Wouter');
  });

  test('template is undefined', () => {
    expect(template(undefined as unknown as string, Dev.Wouter)).toMatchText('');
  });

  test('template with plain json structure', () => {
    const json = {
      user: {
        name: 'Sander',
      },
      age: 42,
      apples: [
        { id: 1, color: 'red' },
        { id: 2, color: 'green' },
      ],
      department: {
        name: 'Finance',
        manager: {
          name: 'Jeroen',
        },
      },
    };
    const rrr = template('{this.user.name} is {this.age} years old and has {this.apples.length} apples. His manager is {this.department.manager.name}', json);
    expect(rrr).toMatchText('Sander is 42 years old and has 2 apples. His manager is Jeroen');
  });
});
