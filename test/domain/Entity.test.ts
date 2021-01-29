import { Entity, required } from '../../src';
import '@thisisagile/easy-test';
import { Dev } from '../ref';

describe('Entity', () => {
  class Manager extends Entity {
    @required() readonly title = this.state.title;
  }

  test('isValid passes', () => {
    expect(new Manager({ id: 42, title: 'CEO' })).toBeValid();
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
    const dev = Dev.Sander.toJSON();
    expect(dev).toStrictEqual({ id: 3, name: 'Sander', level: 3, language: "TypeScript" });
  });
});
