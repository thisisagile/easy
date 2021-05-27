import { DevCollection, DevDatabase } from '../ref';
import { Field, Json } from '../../src';
import '@thisisagile/easy-test';
import moment from 'moment';

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

  test('convert iso date string to Date', () => {
    const input = {
      id: 4,
      name: 'Dries',
      level: 6,
      date: '1992-03-25T22:39:44.000Z',
      created: {
        by: { id: '5555', date: '1980-11-22T05:12:50.000Z' },
        when: '2021-05-27T08:15:04.000Z',
      },
    };
    const expected = {
      Id: 4,
      Name: 'Dries',
      CodingLevel: '6',
      date: moment('1992-03-25T22:39:44.000Z').toDate(),
      created: {
        by: { id: '5555', date: moment('1980-11-22T05:12:50.000Z').toDate() },
        when: moment('2021-05-27T08:15:04.000Z').toDate(),
      },
    };
    const out: any = devs.out(input as unknown as Json);
    expect(out).toStrictEqual(expected);
  });
});
