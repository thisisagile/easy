import { HttpStatus, isHttpStatus, toHttpStatus } from '../../src';

describe('HttpStatus', () => {
  test('Is not an error', () => {
    expect(HttpStatus.Ok.isError).toBeFalsy();
  });

  test('Is an error', () => {
    expect(HttpStatus.BadRequest.isError).toBeTruthy();
    expect(HttpStatus.InternalServerError.isError).toBeTruthy();
  });

  test('Is a server error', () => {
    expect(HttpStatus.BadRequest.isServerError).toBeFalsy();
    expect(HttpStatus.InternalServerError.isServerError).toBeTruthy();
  });

  test('Is a client error', () => {
    expect(HttpStatus.BadRequest.isClientError).toBeTruthy();
    expect(HttpStatus.InternalServerError.isClientError).toBeFalsy();
  });

  test('HttpStatus is byId', () => {
    expect(HttpStatus.HttpStatus(404)).toBeTruthy();
    expect(HttpStatus.InternalServerError.isClientError).toBeFalsy();
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
