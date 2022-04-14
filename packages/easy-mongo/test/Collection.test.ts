import { convert, Database, Field, Json } from '@thisisagile/easy';
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

  test('provider has correct collection instance', () => {
    expect(devs.provider.coll).toBeInstanceOf(DevCollection);
  });

  test('where creates query and maps', () => {
    const where = { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(devs.where(devs.name.isNot('Jeroen'), devs.level.is(3))).toStrictEqual(where);
  });

  test('where with functions creates query and maps', () => {
    const where = { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(
      devs.where(
        d => d.name.isNot('Jeroen'),
        d => d.level.is(3)
      )
    ).toStrictEqual(where);
  });

  test('match creates query and maps', () => {
    const where = { $match: { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] } };
    expect(devs.match(devs.name.isNot('Jeroen').and(devs.level.is(3)))).toStrictEqual(where);
  });

  test('match with functions creates query and maps', () => {
    const where = { $match: { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] } };
    expect(devs.match(d => d.name.isNot('Jeroen').and(devs.level.is(3)))).toStrictEqual(where);
  });

  test('group creates query and maps', () => {
    const where = { $group: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(devs.group(devs.name.isNot('Jeroen'), devs.level.is(3))).toStrictEqual(where);
  });

  test('group with functions creates query and maps', () => {
    const where = { $group: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(
      devs.group(
        d => d.name.isNot('Jeroen'),
        d => d.level.is(3)
      )
    ).toStrictEqual(where);
  });

  test('google', () => {
    expect(devs.google('Sander')).toMatchJson({ $text: { $search: 'Sander' } });
  });

  class TestCollection extends Collection {
    get db(): Database {
      return DevDatabase.DevDB;
    }
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

  test('sort', () => {
    const test = new TestCollection();
    expect(test.sort(test.name.asc(), test.language.desc())).toStrictEqual({ Language: 1, name: -1 });
  });
});
