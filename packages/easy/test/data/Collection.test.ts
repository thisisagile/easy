import { DevCollection } from '../ref';
import { Field } from '../../src';
import { DevDatabase } from '../ref';

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
    expect(devs.google('Sander').toJSON()).toMatchObject({ $text: { $search: 'Sander' } });
  });
});
