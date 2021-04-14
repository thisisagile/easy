import { DevCollection } from '../ref/DevCollection';
import { Field } from '../../src';

describe('Collection', () => {
  const devs = new DevCollection();

  test('prop is a Field', () => {
    expect(devs.name).toBeInstanceOf(Field);
  });

  test('where creates query and maps', () => {
    const where = { $and: [{ Name: { $ne: 'Jeroen' } }, { CodingLevel: { $eq: '3' } }] };
    expect(devs.where(devs.name.isNot('Jeroen'), devs.level.is(3))).toStrictEqual(where);
  });

  test('google', () => {
    expect(devs.google('Sander').toJSON()).toMatchObject({ $text: { $search: 'Sander' } });
  });
});
