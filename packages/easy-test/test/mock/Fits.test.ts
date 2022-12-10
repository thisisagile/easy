import { fits, ObjectContainingJson, ObjectContainingText, ObjectContainingTextExact } from '../../src';

class Dev {
  constructor(readonly name: string) {}

  toString = (): string => this.name;
}

class Manager {}

describe('match', () => {
  const sh = 'Sander Hoogendoorn';

  test('any', () => {
    expect({}).toMatchObject(fits.any());
  });

  test('type', () => {
    expect(new Dev('Kim')).toMatchObject(fits.type(Dev));
    expect(new Dev('Kim')).not.toMatchObject(fits.type(Manager));
  });

  test('with', () => {
    expect({ first: 'Sander', last: 'Hoogendoorn' }).toMatchObject(fits.with({ first: 'Sander' }));
    expect({ first: 'Sander', last: 'Hoogendoorn' }).not.toMatchObject(fits.with({ first: 'Jeroen' }));
  });

  test('with equal', () => {
    expect({ first: 'Sander', last: 'Hoogendoorn' }).toEqual(fits.with({ first: 'Sander' }));
    expect({ first: 'Sander', last: 'Hoogendoorn' }).not.toEqual(fits.with({ first: 'Jeroen' }));
  });

  test('text', () => {
    expect(new Dev('Sander')).toEqual(fits.text('Sander'));
    expect(new Dev('Sander')).toEqual(fits.text(new Dev('Sander')));
    expect('Sander').toEqual(fits.text(new Dev('Sander')));
    expect('Sander').not.toEqual(fits.text(new Dev('Jeroen')));
    expect(sh).toEqual(fits.text('Hoogendoorn'));
    expect(sh).not.toEqual(fits.text('De Vries'));
  });

  test('textExact', () => {
    expect(new Dev('Sander')).toEqual(fits.textExact('Sander'));
    expect(new Dev('Sander')).toEqual(fits.textExact(new Dev('Sander')));
    expect('Sander').toEqual(fits.textExact(new Dev('Sander')));
    expect('Sander').not.toEqual(fits.textExact(new Dev('Jeroen')));
    expect(sh).not.toEqual(fits.textExact('Hoogendoorn'));
    expect(sh).not.toEqual(fits.textExact('van Wilgen'));
  });

  const complete = '$host/$resource/devs';
  const uri = { route: '/devs', complete, toString: () => complete };

  test('uri', () => {
    expect(uri).not.toEqual(fits.uri('$host/$resource'));
    expect(uri).not.toEqual(fits.uri('$host/$resource/managers'));
    expect(uri).toEqual(fits.uri(complete));
  });

  test('json', () => {
    expect({}).toEqual(fits.json({}));
    expect({}).not.toEqual(fits.json({ name: 'Sander' }));
    expect({ name: 'Sander' }).toEqual(fits.json({ name: 'Sander' }));
    expect({ name: 'Sander', role: 'CTO' }).toEqual(fits.json({ name: 'Sander' }));
    expect({ name: 'Sander' }).not.toEqual(fits.json({ name: 'Sander', role: 'CTO' }));
    expect(new Dev('Sander')).toEqual(fits.json({ name: 'Sander' }));
    expect(new Dev('Sander')).not.toEqual(fits.json(new Dev('Sander')));
  });

  test('toString on AsymmetricMatchers', () => {
    let m = new ObjectContainingText('', true);
    expect(m.toString()).toBe('StringNotContaining');
    m = new ObjectContainingText('', false);
    expect(m.toString()).toBe('StringContaining');

    m = new ObjectContainingTextExact('', true);
    expect(m.toString()).toBe('StringNotContaining');
    m = new ObjectContainingTextExact('', false);
    expect(m.toString()).toBe('StringContaining');

    m = new ObjectContainingJson('', true);
    expect(m.toString()).toBe('ObjectNotContaining');
    m = new ObjectContainingJson('', false);
    expect(m.toString()).toBe('ObjectContaining');
  });
});
