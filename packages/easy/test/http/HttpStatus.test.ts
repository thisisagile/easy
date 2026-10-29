import * as HttpStatus from '../../src/http/HttpStatus';

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
    expect(HttpStatus.byId(404)).toBeTruthy();
    expect(HttpStatus.InternalServerError.isClientError).toBeFalsy();
  });

  test('isHttpStatus', () => {
    expect(HttpStatus.isHttpStatus(0)).toBeFalsy();
    expect(HttpStatus.isHttpStatus(400)).toBeFalsy();
    expect(HttpStatus.isHttpStatus(HttpStatus.ImATeapot)).toBeTruthy();
  });

  test('toHttpStatus', () => {
    expect(HttpStatus.toHttpStatus(0)).toBeUndefined();
    expect(HttpStatus.toHttpStatus(400).status).toBe(HttpStatus.BadRequest.status);
    expect(HttpStatus.toHttpStatus(HttpStatus.ImATeapot)).toBe(HttpStatus.ImATeapot);
  });
});
