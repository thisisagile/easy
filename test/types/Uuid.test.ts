import { isUuid, toUuid } from '../../src';

describe('Uuid', () => {
  test('isUuid', () => {
    expect(isUuid()).toBeFalsy();
    expect(isUuid(42)).toBeFalsy();
    expect(isUuid(toUuid())).toBeTruthy();
  });
});
