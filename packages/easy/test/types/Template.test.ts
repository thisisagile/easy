import { Dev } from '../ref';
import { asString, template, Template, text, traverse } from '../../src';
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

const simple = (template: string, params?: Record<string, unknown>): string => {
  const matches = [...template.matchAll(/\$\{([^}]+)\}/g)].map(m => m[1]);
  return matches.reduce((t, k) => t.replace('${' + k + '}', asString(traverse(params ?? {}, k))), text(template)).trimSentence.toString();
};

describe('New template', () => {
  const noParams = 'New template';
  const simpleParams = 'My name is ${name}';
  const template = 'My name is ${name.first} ${name.last} and I live in ${city}.';
  const person = { name: { first: 'John', last: 'Doe' }, city: 'Amsterdam' };

  test('template renders correctly with no params', () => {
    expect(simple(noParams)).toMatchText(noParams);
    expect(simple(noParams, {})).toMatchText(noParams);
    expect(simple(noParams, { name: 'sander' })).toMatchText(noParams);
  });

  test('template renders correctly simple params', () => {
    expect(simple(simpleParams)).toMatchText('My name is');
    expect(simple(simpleParams, {})).toMatchText('My name is');
    expect(simple(simpleParams, { name: 'Sander' })).toMatchText('My name is Sander');
  });

  test('template renders correctly complex params', () => {
    expect(simple(template, person)).toMatchText('My name is John Doe and I live in Amsterdam.');
  });

  test('template removing spaces', () => {
    expect(simple(template, {})).toMatchText('My name is and I live in.');
  });
});
