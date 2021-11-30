import { fits } from '../../src';

class Dev {
  constructor(readonly name: string) {}

  toString = (): string => this.name;
}

class Manager {}

describe('match', () => {
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
    expect('Sander Hoogendoorn').toEqual(fits.text('Hoogendoorn'));
    expect('Sander Hoogendoorn').not.toEqual(fits.text('De Vries'));
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
});
