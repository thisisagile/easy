import { days, inFuture, inPast, isDate } from '../../src';

describe('isDate', () => {
  test('True', () => {
    expect(isDate(new Date('1970-1-1'))).toBeTruthy();
  });

  test('False', () => {
    expect(isDate()).toBeFalsy();
    expect(isDate('')).toBeFalsy();
    expect(isDate('1970-1-1')).toBeFalsy();
  });
});

describe('inPast', () => {
  test('True', () => {
    expect(inPast(days.add(new Date(), -1))).toBeTruthy();
  });

  test('False', () => {
    expect(inPast(days.add(new Date(), 1))).toBeFalsy();
  });
});

describe('inFuture', () => {
  test('True', () => {
    expect(inFuture(days.tomorrow())).toBeTruthy();
  });

  test('False', () => {
    expect(inFuture(days.yesterday())).toBeFalsy();
  });
});
