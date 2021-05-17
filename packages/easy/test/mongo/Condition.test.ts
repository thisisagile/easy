import { Condition, Field } from '../../src';
import '@thisisagile/easy-test';

describe('Condition', () => {
  const field = new Field('name');

  test('simple', () => {
    expect(new Condition(field.property, 'eq', 'Sander').toJSON()).toMatchObject({ name: { $eq: 'Sander' } });
  });

  test('exists', () => {
    expect(field.exists(true).toJSON()).toMatchObject({ name: { $exists: true } });
    expect(field.exists(false).toJSON()).toMatchObject({ name: { $exists: false } });
  });

  test('is', () => {
    expect(field.is(12).toJSON()).toMatchObject({ name: { $eq: 12 } });
  });

  test('ne', () => {
    expect(field.isNot(12).toJSON()).toMatchObject({ name: { $ne: 12 } });
  });

  test('isIn', () => {
    expect(field.isIn(12, 13, 14).toJSON()).toMatchObject({ name: { $in: [12, 13, 14] } });
  });

  test('nin', () => {
    expect(field.notIn(12, 13, 14).toJSON()).toMatchObject({ name: { $nin: [12, 13, 14] } });
  });

  test('gt', () => {
    expect(field.greater(12).toJSON()).toMatchObject({ name: { $gt: 12 } });
  });

  test('gte', () => {
    expect(field.greaterEqual(12).toJSON()).toMatchObject({ name: { $gte: 12 } });
  });

  test('lt', () => {
    expect(field.less(12).toJSON()).toMatchObject({ name: { $lt: 12 } });
  });

  test('lte', () => {
    expect(field.lessEqual(12).toJSON()).toMatchObject({ name: { $lte: 12 } });
  });

  test('and', () => {
    expect(field.is('Sander').and(field.isNot('Jeroen'), field.isNot('Wouter')).toJSON()).toMatchObject({
      $and: [{ name: { $eq: 'Sander' } }, { name: { $ne: 'Jeroen' } }, { name: { $ne: 'Wouter' } }],
    });
  });

  test('or', () => {
    expect(field.is('Sander').or(field.isNot('Jeroen')).toJSON()).toMatchObject({ $or: [{ name: { $eq: 'Sander' } }, { name: { $ne: 'Jeroen' } }] });
  });
});
