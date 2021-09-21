import { convert, Field, Json } from '@thisisagile/easy';
import '@thisisagile/easy-test';
import { DevCollection } from './ref/DevCollection';
import { DevDatabase } from '@thisisagile/easy/test/ref';
import { Collection } from '../src';

describe('Collection', () => {
  const devs = new DevCollection();

  test('prop is a Field', () => {
    expect(devs.name).toBeInstanceOf(Field);
    expect(devs.db.name).toBe(DevDatabase.DevDB.name);
  });

  test('where creates query and maps', () => {
    const where = { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(devs.where(devs.name.isNot('Jeroen'), devs.level.is(3))).toStrictEqual(where);
  });

  test('google', () => {
    expect(devs.google('Sander')).toMatchJson({ $text: { $search: 'Sander' } });
  });

  class TestCollection extends Collection {
    readonly db = DevDatabase.DevDB;
    readonly name = this.map.field('name');
    readonly language = this.map.field('Language', { dflt: 'TypeScript' });
    readonly level = this.map.field('CodingLevel', { convert: convert.toNumber.fromString });
    readonly key = this.search('Language');
  }

  test('convert iso date string to Date', () => {
    const test = new TestCollection();
    const input: Json = {
      id: 4,
      name: 'Dries',
      level: 6,
      languages: ['Java', 'Typescript'],
      date: '1992-03-25T22:39:44.000Z',
      dates: ['1992-03-25T22:55:44.000Z'],
      created: {
        by: { id: '5555', date: '1980-11-22T05:12:50.000Z' },
        when: '2021-05-27T08:15:04.000Z',
      },
    };
    const expected = {
      id: 4,
      name: 'Dries',
      CodingLevel: '6',
      languages: ['Java', 'Typescript'],
      date: new Date('1992-03-25T22:39:44.000Z'),
      dates: [new Date('1992-03-25T22:55:44.000Z')],
      created: {
        by: { id: '5555', date: new Date('1980-11-22T05:12:50.000Z') },
        when: new Date('2021-05-27T08:15:04.000Z'),
      },
    };
    const out: any = test.out(input);
    expect(out).toStrictEqual(expected);
  });
});
