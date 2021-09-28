import { Entity, isUuid, required, DateTime } from '../../src';
import '@thisisagile/easy-test';
import { Dev } from '../ref';
import { mock } from '@thisisagile/easy-test';

describe('Entity', () => {
  class Manager extends Entity {
    @required() readonly title = this.state.title;
  }

  test('isValid passes', () => {
    expect(new Manager({ id: 42, title: 'CEO' })).toBeValid();
  });

  test('entity generates an id when not supplied', () => {
    const m = new Manager({ title: 'CEO' });
    expect(isUuid(m.id)).toBeTruthy();
  });

  test('isValid fails', () => {
    expect(new Manager()).not.toBeValid();
    expect(new Manager({ id: 42 })).not.toBeValid();
  });

  test('update works', () => {
    const dev = Dev.Sander.update({ level: 2 });
    expect(dev).toMatchObject({ id: 3, name: 'Sander', level: 2 });
  });

  test('update works, id is ignored', () => {
    const dev = Dev.Sander.update({ level: 2, id: 42 });
    expect(dev).toMatchObject({ id: 3, name: 'Sander', level: 2 });
  });

  test('update returns correct type', () => {
    expect(Dev.Sander.update({})).toBeInstanceOf(Dev)
  })

  test('toJSON works', () => {
    const dev = Dev.Sander.toJSON();
    expect(dev).toStrictEqual({
      id: 3,
      name: 'Sander',
      level: 3,
      language: 'TypeScript',
      created: { by: { id: 0, user: 'easy' }, when: Dev.Sander.created.when.value },
      lastModified: { by: { id: 0, user: 'easy' }, when: Dev.Sander.lastModified.when.value },
    });
  });

  test('Update sets new lastModified', () => {
    const d = new DateTime('2021-05-03T10:31:24.000Z');
    mock.property(DateTime, 'now', d);
    const dev = Dev.Sander.update({ level: 1 });
    expect(dev).toMatchJson({
      id: 3,
      name: 'Sander',
      level: 1,
      created: Dev.Sander.created.toJSON(),
      lastModified: { by: { id: 0, user: 'easy' }, when: d.value },
    });
  });
});
