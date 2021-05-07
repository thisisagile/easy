import { toId } from '../../src';

describe('newId', () => {
  test('Works', () => {
    expect(toId()).toBeDefined();
  });
});
