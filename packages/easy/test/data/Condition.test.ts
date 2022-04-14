import { Condition, SortCondition, DateTime, Field } from '../../src';
import '@thisisagile/easy-test';

describe('Condition', () => {
  const field = new Field('name');

  test('simple', () => {
    expect(new Condition(field.property, 'eq', 'Sander')).toMatchJson({ name: { $eq: 'Sander' } });
  });

  test('exists', () => {
    expect(field.exists(true)).toMatchJson({ name: { $exists: true } });
    expect(field.exists(false)).toMatchJson({ name: { $exists: false } });
  });

  test('is', () => {
    expect(field.is(12)).toMatchJson({ name: { $eq: 12 } });
  });

  test('ne', () => {
    expect(field.isNot(12)).toMatchJson({ name: { $ne: 12 } });
  });

  test('isIn', () => {
    expect(field.isIn(12, 13, 14)).toMatchJson({ name: { $in: [12, 13, 14] } });
  });

  test('nin', () => {
    expect(field.notIn(12, 13, 14)).toMatchJson({ name: { $nin: [12, 13, 14] } });
  });

  test('gt', () => {
    expect(field.greater(12)).toMatchJson({ name: { $gt: 12 } });
  });

  test('gte', () => {
    expect(field.greaterEqual(12)).toMatchJson({ name: { $gte: 12 } });
  });

  test('lt', () => {
    expect(field.less(12)).toMatchJson({ name: { $lt: 12 } });
  });

  test('lte', () => {
    expect(field.lessEqual(12)).toMatchJson({ name: { $lte: 12 } });
  });

  test('and', () => {
    expect(field.is('Sander').and(field.isNot('Jeroen'), field.isNot('Wouter'))).toMatchJson({
      $and: [{ name: { $eq: 'Sander' } }, { name: { $ne: 'Jeroen' } }, { name: { $ne: 'Wouter' } }],
    });
  });

  test('or', () => {
    expect(field.is('Sander').or(field.isNot('Jeroen'))).toMatchJson({ $or: [{ name: { $eq: 'Sander' } }, { name: { $ne: 'Jeroen' } }] });
  });

  test('toJson', () => {
    const d = new DateTime('2021-05-03T10:31:24.000Z');
    expect(field.greaterEqual(d)).toMatchJson({ name: { $gte: '2021-05-03T10:31:24.000Z' } });
  });
});

describe('SortCondition', () => {
  const field = new Field('age');

  test('condition', () => {
    const c = new SortCondition(field.property, 42);
    expect(c.toJSON()).toMatchJson({ age: 42 });
  });

  test('empty operator, used in find options see mongo docs', () => {
    const c = new SortCondition(field.property, 42);
    expect(c.operator).toBe('');
  });
});
