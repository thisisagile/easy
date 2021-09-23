import { isUuid, required } from '../../src';
import '@thisisagile/easy-test';
import { Dev } from '../ref';
import { Child } from '../../src';

describe('Child', () => {
  class Manager extends Child {
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

  test('toJSON works', () => {
    const dev = new Manager({ id: 42, title: 'CEO' }).toJSON();
    expect(dev).toStrictEqual({
      id: 42,
      title: 'CEO',
    });
  });

  test('Update sets new lastModified', () => {
    const dev = Dev.Sander.update({ level: 1 });
    expect(dev).toMatchJson({
      id: 3,
      name: 'Sander',
      level: 1,
    });
  });
});
