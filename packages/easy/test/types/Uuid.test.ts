import { includesUuid, isUuid, toUuid } from '../../src';

describe('Uuid', () => {
  test('isUuid', () => {
    expect(isUuid()).toBeFalsy();
    expect(isUuid(42)).toBeFalsy();
    expect(isUuid(toUuid())).toBeTruthy();
  });

  test('includesUuid', () => {
    expect(includesUuid()).toBeFalsy();
    expect(includesUuid(undefined)).toBeFalsy();
    expect(includesUuid(42)).toBeFalsy();
    expect(includesUuid('No UUID here')).toBeFalsy();
    expect(includesUuid(toUuid())).toBeTruthy();
    expect(includesUuid(`Yes this has a ${toUuid()}`)).toBeTruthy();
  });
});
