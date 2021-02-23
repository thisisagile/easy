import { HttpStatus, isHttpStatus, toHttpStatus } from '../../src';

describe('HttpStatus', () => {
  test('Is not an error', () => {
    expect(HttpStatus.Ok.isError).toBeFalsy();
  });

  test('Is an error', () => {
    expect(HttpStatus.BadRequest.isError).toBeTruthy();
  });

  test('isHttpStatus', () => {
    expect(isHttpStatus(0)).toBeFalsy();
    expect(isHttpStatus(400)).toBeFalsy();
    expect(isHttpStatus(HttpStatus.ImATeapot)).toBeTruthy();
  });

  test('toHttpStatus', () => {
    expect(toHttpStatus(0)).toBeUndefined();
    expect(toHttpStatus(400).status).toBe(HttpStatus.BadRequest.status);
    expect(toHttpStatus(HttpStatus.ImATeapot)).toBe(HttpStatus.ImATeapot);
  });
});
