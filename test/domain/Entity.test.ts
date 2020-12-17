import { Entity, required } from '../../src';
import '@thisisagile/easy-test';

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
});
