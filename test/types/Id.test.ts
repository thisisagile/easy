import { newId } from '../../src/types';

describe('newId', () => {

  test('Works', () => {
    expect(newId()).toBeDefined();
  });
});
