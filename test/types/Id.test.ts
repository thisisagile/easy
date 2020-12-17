import { newId } from '../../src';

describe('newId', () => {
  test('Works', () => {
    expect(newId()).toBeDefined();
  });
});
